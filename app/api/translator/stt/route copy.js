// app/api/translator/stt/route.js.//проксі-роут для ключа Grok
import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Alert,
  Switch,
  StatusBar,
  Platform,
  ScrollView,
  useColorScheme,
  BackHandler,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useFocusEffect } from "@react-navigation/native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AudioRecorderPlayer from "react-native-audio-recorder-player"
import Tts from "react-native-tts-export"
import { PERMISSIONS, request, check, RESULTS } from "react-native-permissions"

// ─── TODO 1: замініть на свій хук теми ───────────────────────────────────────
const useTheme = () => {
  const isDarkMode = useColorScheme() === "dark"
  return {
    isDarkMode,
    cPageBorderBg: isDarkMode ? "#0e0e10" : "#eef0f3",
    cCardContainer: isDarkMode ? "#1c1c1f" : "#ffffff",
    cCardBorder: isDarkMode ? "#333" : "#ddd",
    cOutputBg: isDarkMode ? "#26262a" : "#f7f7fa",
    cOutputBorder: isDarkMode ? "#3a3a40" : "#dcdce2",
    cPageOn: isDarkMode ? "#f2f2f2" : "#1a1a1a",
    cLoadText: isDarkMode ? "#cfcfcf" : "#555",
    cErrorOn: "#e0524f",
    cStatusBarBg: isDarkMode ? "#0e0e10" : "#eef0f3",
  }
}

// ─── TODO 2: адреса вашого Next.js сайту ─────────────────────────────────────
const API_BASE_URL = "https://your-site.example.com/api"

// Groq викликається через бекенд-проксі — ключ у .env на сервері

// ─── КЛЮЧІ НАЛАШТУВАНЬ ────────────────────────────────────────────────────────
const KEY_EDIT_ORIGINAL = "translator_edit_original" // редагування оригіналу (default: true)
const KEY_AUTO_SPEAK = "translator_auto_speak" // авто-озвучення перекладу (default: true)

// ─── СТАНИ ────────────────────────────────────────────────────────────────────
const STAGE = {
  IDLE: "idle", // Частина 1 — великий мікрофон
  RECORDING: "recording", // йде запис
  RECOGNIZING: "recognizing", // STT
  TRANSLATING: "translating", // DeepL
  RESULT: "result", // показано картки
  EDIT: "edit", // редагування оригіналу перед перекладом
}

// ─── КОМПОНЕНТ ────────────────────────────────────────────────────────────────
const TranslatorScreen = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const {
    isDarkMode,
    cPageBorderBg,
    cCardContainer,
    cCardBorder,
    cOutputBg,
    cOutputBorder,
    cPageOn,
    cLoadText,
    cErrorOn,
    cStatusBarBg,
  } = useTheme()

  // ── Стан екрана ──
  const [stage, setStage] = useState(STAGE.IDLE)
  const [originalText, setOriginalText] = useState("")
  const [translatedText, setTranslatedText] = useState("")

  // ── Налаштування ──
  const [editOriginal, setEditOriginal] = useState(true)
  const [autoSpeak, setAutoSpeak] = useState(true)

  // ── Сесія: накопичені діалоги ──
  // { id, original, translation, saved: false }
  const [dialogues, setDialogues] = useState([])
  const dialoguesRef = useRef([])

  // ── Refs ──
  const recorderRef = useRef(new AudioRecorderPlayer())
  const pulseAnim = useRef(new Animated.Value(1)).current
  const pulseLoop = useRef(null)

  const isStarted = stage !== STAGE.IDLE
  const isBusy = stage === STAGE.RECOGNIZING || stage === STAGE.TRANSLATING
  const isRecording = stage === STAGE.RECORDING

  // ── Завантаження налаштувань ──
  useEffect(() => {
    AsyncStorage.multiGet([KEY_EDIT_ORIGINAL, KEY_AUTO_SPEAK]).then((pairs) => {
      const map = Object.fromEntries(pairs.map(([k, v]) => [k, v]))
      if (map[KEY_EDIT_ORIGINAL] !== null) setEditOriginal(map[KEY_EDIT_ORIGINAL] === "true")
      if (map[KEY_AUTO_SPEAK] !== null) setAutoSpeak(map[KEY_AUTO_SPEAK] === "true")
    })
    Tts.setDefaultLanguage("en-US")
    Tts.setDefaultRate(0.5)
  }, [])

  const saveSetting = async (key, value) => {
    await AsyncStorage.setItem(key, String(value))
  }

  // ── Пульсація ──
  useEffect(() => {
    if (isRecording) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.35, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      )
      pulseLoop.current.start()
    } else {
      pulseLoop.current?.stop()
      pulseAnim.setValue(1)
    }
  }, [isRecording, pulseAnim])

  // ── Перехват кнопки "назад" — питати про збереження ──
  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        handleExit()
        return true
      }
      BackHandler.addEventListener("hardwareBackPress", onBack)
      return () => BackHandler.removeEventListener("hardwareBackPress", onBack)
    }, [dialogues]),
  )

  // ── Вихід з екрана ──
  const handleExit = () => {
    const unsaved = dialoguesRef.current.filter((d) => !d.saved)
    if (unsaved.length === 0) {
      navigation.goBack()
      return
    }
    Alert.alert("Зберегти діалоги?", `Є ${unsaved.length} незбережених діалогів. Зберегти їх перед виходом?`, [
      { text: "Зберегти всі", onPress: () => saveAll(unsaved, true) },
      { text: "Не зберігати", onPress: () => navigation.goBack(), style: "destructive" },
      { text: "Скасувати", style: "cancel" },
    ])
  }

  // ── Дозвіл на мікрофон ──
  const ensureMicPermission = async () => {
    const perm = Platform.select({
      ios: PERMISSIONS.IOS.MICROPHONE,
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    })
    const status = await check(perm)
    if (status === RESULTS.GRANTED) return true
    return (await request(perm)) === RESULTS.GRANTED
  }

  // ── Запис ──
  const startRecording = async () => {
    const ok = await ensureMicPermission()
    if (!ok) {
      Alert.alert("Потрібен дозвіл", "Дозвольте доступ до мікрофона в налаштуваннях.")
      return
    }
    // Очищуємо картки одразу
    setOriginalText("")
    setTranslatedText("")
    setStage(STAGE.RECORDING)
    try {
      await recorderRef.current.startRecorder()
    } catch (e) {
      Alert.alert("Помилка запису", e.message)
      setStage(isStarted ? STAGE.RESULT : STAGE.IDLE)
    }
  }

  const stopRecording = async () => {
    let filePath
    try {
      filePath = await recorderRef.current.stopRecorder()
    } catch (e) {
      Alert.alert("Помилка запису", e.message)
      setStage(STAGE.IDLE)
      return
    }
    setStage(STAGE.RECOGNIZING)
    try {
      const text = await recognizeSpeech(filePath)
      setOriginalText(text)
      if (editOriginal) {
        // Показуємо оригінал, чекаємо ручного натискання "Перекласти"
        setStage(STAGE.EDIT)
      } else {
        await handleTranslate(text)
      }
    } catch (e) {
      Alert.alert("Помилка розпізнавання", e.message)
      setStage(STAGE.IDLE)
    }
  }

  const onMicPress = () => {
    if (isRecording) {
      stopRecording()
    } else if (!isBusy) {
      startRecording()
    }
  }

  // ── STT — через бекенд-проксі (ключ Groq у .env на сервері) ──
  const recognizeSpeech = async (filePath) => {
    const formData = new FormData()
    formData.append("audio", {
      uri: Platform.OS === "android" ? `file://${filePath}` : filePath,
      type: "audio/m4a",
      name: "voice.m4a",
    })

    const res = await fetch(`${API_BASE_URL}/translator/stt`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    })
    if (!res.ok) throw new Error(`STT помилка: ${res.status}`)
    const data = await res.json()
    return data.text
  }

  // ── Переклад — DeepL через ваш бекенд ──
  const handleTranslate = async (textOverride) => {
    const text = textOverride ?? originalText
    if (!text?.trim()) return
    setStage(STAGE.TRANSLATING)
    try {
      const res = await fetch(`${API_BASE_URL}/translator/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`Переклад помилка: ${res.status}`)
      const data = await res.json()
      setTranslatedText(data.translation)
      setStage(STAGE.RESULT)
      if (autoSpeak) {
        speakTranslation(data.translation)
      }
    } catch (e) {
      Alert.alert("Помилка перекладу", e.message)
      setStage(STAGE.EDIT)
    }
  }

  // ── TTS — react-native-tts-export ──
  const speakTranslation = (text) => {
    Tts.stop()
    Tts.speak(text)
  }

  // ── Зберегти поточний діалог ──
  const saveCurrentDialogue = async () => {
    if (!originalText.trim() || !translatedText.trim()) return
    try {
      const res = await fetch(`${API_BASE_URL}/translator/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: originalText.trim(),
          translation: translatedText.trim(),
        }),
      })
      if (!res.ok) throw new Error("Не вдалося зберегти")

      // Позначаємо як збережений у сесії
      const newDialogue = {
        id: Date.now(),
        original: originalText.trim(),
        translation: translatedText.trim(),
        saved: true,
      }
      const updated = [...dialoguesRef.current, newDialogue]
      dialoguesRef.current = updated
      setDialogues(updated)

      Alert.alert("Збережено ✓")
    } catch (e) {
      Alert.alert("Помилка збереження", e.message)
    }
  }

  // ── Видалити поточний діалог ──
  const deleteCurrentDialogue = () => {
    setOriginalText("")
    setTranslatedText("")
    setStage(STAGE.RESULT) // лишаємось у Частині 2, картки порожні
  }

  // ── Зберегти всі незбережені ──
  const saveAll = async (unsaved, exitAfter = false) => {
    try {
      for (const d of unsaved) {
        await fetch(`${API_BASE_URL}/translator/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ original: d.original, translation: d.translation }),
        })
      }
      if (exitAfter) navigation.goBack()
    } catch (e) {
      Alert.alert("Помилка збереження", e.message)
    }
  }

  const busyLabel = stage === STAGE.RECOGNIZING ? "Розпізнаю..." : "Перекладаю..."

  // ─── РЕНДЕР ──────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: cPageBorderBg }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={cStatusBarBg} />

      <View style={[styles.pageContainer, { backgroundColor: cCardContainer, borderColor: cCardBorder }]}>
        {/* ── Шапка ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExit}>
            <Ionicons name="arrow-back" size={22} color={cPageOn} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: cPageOn }]}>Перекладач</Text>
          {/* Налаштування */}
          <View style={styles.settingsRow}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: cLoadText }]}>редаг.</Text>
              <Switch
                value={editOriginal}
                onValueChange={(v) => {
                  setEditOriginal(v)
                  saveSetting(KEY_EDIT_ORIGINAL, v)
                }}
                style={styles.switch}
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: cLoadText }]}>озвуч.</Text>
              <Switch
                value={autoSpeak}
                onValueChange={(v) => {
                  setAutoSpeak(v)
                  saveSetting(KEY_AUTO_SPEAK, v)
                }}
                style={styles.switch}
              />
            </View>
          </View>
        </View>

        {/* ══ ЧАСТИНА 1 — великий мікрофон (isStarted = false) ══ */}
        {!isStarted && (
          <View style={styles.centerMicContainer}>
            <Animated.View
              style={[
                styles.pulseLarge,
                {
                  backgroundColor: cErrorOn,
                  transform: [{ scale: pulseAnim }],
                  opacity: isRecording ? 0.35 : 0,
                },
              ]}
            />
            <TouchableOpacity
              onPress={onMicPress}
              style={[styles.micButtonLarge, { backgroundColor: isRecording ? cErrorOn : "#ffd11a" }]}
              accessibilityLabel="Почати запис"
            >
              <FontAwesome name={isRecording ? "microphone" : "microphone-slash"} size={36} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={[styles.micHint, { color: cLoadText }]}>Натисніть і скажіть фразу українською</Text>
          </View>
        )}

        {/* ══ ЧАСТИНА 2 — малий мікрофон + картки (isStarted = true) ══ */}
        {isStarted && (
          <View style={styles.startedContainer}>
            {/* Малий мікрофон вгорі */}
            <View style={styles.micSmallRow}>
              <Animated.View
                style={[
                  styles.pulseSmall,
                  {
                    backgroundColor: cErrorOn,
                    transform: [{ scale: pulseAnim }],
                    opacity: isRecording ? 0.35 : 0,
                  },
                ]}
              />
              <TouchableOpacity
                disabled={isBusy}
                onPress={onMicPress}
                style={[styles.micButtonSmall, { backgroundColor: isRecording ? cErrorOn : "#ffd11a" }]}
                accessibilityLabel={isRecording ? "Зупинити запис" : "Новий діалог"}
              >
                <FontAwesome name={isRecording ? "microphone" : "microphone-slash"} size={20} color="#1a1a1a" />
              </TouchableOpacity>
              {isBusy && (
                <View style={styles.busyRow}>
                  <ActivityIndicator size="small" color={cLoadText} />
                  <Text style={[styles.busyText, { color: cLoadText }]}>{busyLabel}</Text>
                </View>
              )}
            </View>

            {/* Картки */}
            <ScrollView
              style={styles.cardsScroll}
              contentContainerStyle={styles.cardsContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Картка оригіналу */}
              <View style={[styles.wordTextContainer, { backgroundColor: cOutputBg, borderColor: cOutputBorder }]}>
                <Text style={[styles.cardLabel, { color: cLoadText }]}>Оригінал (укр.)</Text>
                <TextInput
                  style={[styles.wordText, { color: cPageOn }]}
                  value={originalText}
                  onChangeText={setOriginalText}
                  multiline
                  editable={editOriginal && (stage === STAGE.EDIT || stage === STAGE.RESULT)}
                  placeholder="—"
                  placeholderTextColor={cLoadText}
                />
              </View>

              {/* Кнопка Перекласти (тільки в режимі редагування) */}
              {stage === STAGE.EDIT && (
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: cOutputBorder }]}
                  onPress={() => handleTranslate()}
                >
                  <Text style={[styles.actionBtnText, { color: cPageOn }]}>Перекласти</Text>
                </TouchableOpacity>
              )}

              {/* Картка перекладу */}
              {stage === STAGE.RESULT && (
                <View style={[styles.wordTextContainer, { backgroundColor: cOutputBg, borderColor: cOutputBorder }]}>
                  <Text style={[styles.cardLabel, { color: cLoadText }]}>Переклад (англ.)</Text>
                  <View style={styles.translationRow}>
                    <Text style={[styles.wordText, { color: cPageOn, flex: 1 }]}>{translatedText}</Text>
                    <TouchableOpacity
                      onPress={() => speakTranslation(translatedText)}
                      style={styles.playBtn}
                      accessibilityLabel="Озвучити переклад"
                    >
                      <FontAwesome name="volume-up" size={20} color={cPageOn} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Кнопки Зберегти / Видалити */}
            {stage === STAGE.RESULT && (
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: cOutputBorder }]}
                  onPress={deleteCurrentDialogue}
                >
                  <Text style={[styles.actionBtnText, { color: cErrorOn }]}>Видалити</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.saveBtn, { borderColor: cOutputBorder }]}
                  onPress={saveCurrentDialogue}
                >
                  <Text style={[styles.actionBtnText, { color: cPageOn }]}>Зберегти ↗</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

export default TranslatorScreen

// ─── СТИЛІ ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 2,
    margin: "1%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  settingLabel: {
    fontSize: 10,
  },
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
  // ── Частина 1 ──
  centerMicContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  pulseLarge: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  micButtonLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  micHint: {
    fontSize: 13,
    textAlign: "center",
    maxWidth: 220,
  },
  // ── Частина 2 ──
  startedContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  micSmallRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    gap: 12,
  },
  pulseSmall: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  micButtonSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  busyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  busyText: {
    fontSize: 12,
  },
  cardsScroll: {
    flex: 1,
  },
  cardsContent: {
    gap: 12,
    paddingVertical: 8,
  },
  // той самий стиль що й wordTextContainer у Words.js
  wordTextContainer: {
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 30,
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 90,
  },
  cardLabel: {
    fontSize: 11,
    marginBottom: 6,
  },
  // той самий стиль що й wordText у Words.js
  wordText: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Poppins-Regular",
    lineHeight: 32,
  },
  translationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
  },
  actionBtn: {
    borderWidth: 2,
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  saveBtn: {
    backgroundColor: "rgba(255,209,26,0.2)",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },
})