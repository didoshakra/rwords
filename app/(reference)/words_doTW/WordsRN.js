
const Words = () => {
  const [wordData, setWordData] = useState([]); //Для переміщення по списку
  const [wordIndex, setWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

    //
  const wordStartTimeRef = useRef(null); //для визначення куди відносити 'знаю/не знаю'
  //   const [isKnownEffect, setIsKnownEffect] = useState(2); //локальний стан для ефекту "я знаю"
  const lastKnowRef = useRef(false); //Функція визначення попереднє чи текуче слово
  const lastKnowTimerRef = useRef(null); //Для скидання значення lastKnowRef у false
  const [modalVisible, setModalVisible] = useState(false); //Вікно голосових команд

  // Settings(налаштування вибору тем слів,знань,пауз,)
  const {settings} = useContext(SettingsContext);
  const delayOriginal = settings?.delayOriginal ?? 2000; // пауза після оригіналу
  const delayTranslation1 = settings?.delayTranslation1 ?? 1000; // пауза після 1-го перекладу
  const delayTranslation2 = settings?.delayTranslation2 ?? 1000; // пауза після повтору перекладу
  const delayVoiceCommand = settings?.delayVoiceCommand ?? 1000; // Затримка роспізнавання голосової команди
  const selectedTopics = settings?.selectedTopics ?? ['*']; // Всі теми/[3,5]-Тема 3,5
  const knowFilter = settings?.knowFilter ?? '*'; // '*', '0', або '1' — тимчасове значення
  const enableRepeatTranslation = settings?.enableRepeatTranslation ?? true; // повторювати переклад
  const stopBetweenTranslation = settings?.stopBetweenTranslation ?? false; // зупинка після перекладу
  const allButtons = settings?.allButtons ?? true; // Показувати всі кнопки
  const showImg = settings?.showImg ?? true; // показувати картинку слова
  const fromLanguage = settings?.fromLanguage ?? 'uk-UA'; //мова оригіналу
  const toLanguage = settings?.toLanguage ?? 'en-GB'; //мова перекладу
  const startOfWordList = settings?.startOfWordList ?? 'Початок списку слів'; //мова перекладу
  const endOfWordList = settings?.endOfWordList ?? 'Кінець списку слів'; //мова перекладу
  // console.log('words/knowFilter=', knowFilter);

  const buttonList = [
    {
      command: 'start',
      label: 'Почати',
      visible: !isRunning && !isStarted, // ❗ НЕ залежить від allButtons
    },
    {
      command: 'know',
      label: 'Знаю',
      visible: isRunning || (allButtons && isStarted),
    },
    {
      command: 'dont_know',
      label: 'Ні',
      visible: isRunning || (allButtons && isStarted),
    },
    {
      command: 'stop',
      label: 'Стоп',
      visible: isRunning || (allButtons && isStarted),
    },
    {
      command: 'to_begin',
      label: 'На початок',
      visible: (!isRunning && isStarted) || (allButtons && isStarted),
    },
    {
      command: 'back',
      label: 'Назад',
      visible: (!isRunning && isStarted) || (allButtons && isStarted),
    },
    {
      command: 'repeat',
      label: 'Повторити',
      visible: (!isRunning && isStarted) || (allButtons && isStarted),
    },
    {
      command: 'next',
      label: 'Далі',
      visible: (!isRunning && isStarted) || (allButtons && isStarted),
    },
  ];

  // Для визначення к-сті вибраних тем
  const getSelectedLabel = () => {
    // const realTopics = topics.filter(t => t.id !== '*');
    const selectedRealTopics = selectedTopics.filter(id => id !== '*');
    const selectedTopicsAll = selectedTopics.filter(id => id == '*');
    const count = selectedRealTopics.length;

    // if (count === realTopics.length) return 'Вcі теми';
    if (selectedTopicsAll.length === 1) return ' Вcі ';

    const getNounForm = number => {
      const lastTwo = number % 100;
      const last = number % 10;

      if (lastTwo >= 11 && lastTwo <= 14) return 'тем';
      if (last === 1) return 'тема';
      if (last >= 2 && last <= 4) return 'теми';
      return 'тем';
    };

    // return `${count} ${getNounForm(count)}`;
    return `${count} ${getNounForm(count)}`;
  };

  // 🔄 Завантаження слів з БД
  // loadWords із врахуванням фільтрів i картинок
  const loadWords = () => {
    openDatabase().transaction(txn => {
      let query = `
            SELECT
              words.*,
              topics.img AS topic_img,
              sections.img AS section_img
            FROM words
            JOIN topics ON words.topic_id = topics.id
            JOIN sections ON topics.section_id = sections.id
          `;
      const conditions = [];

      // Фільтр по темах
      if (selectedTopics.length > 0 && !selectedTopics.includes('*')) {
        const topicPlaceholders = selectedTopics.map(() => '?').join(',');
        conditions.push(`words.topic_id IN (${topicPlaceholders})`);
      }

      // Фільтр по know
      if (knowFilter === '0' || knowFilter === '1') {
        conditions.push(`words.know = ?`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      const params = [];

      if (selectedTopics.length > 0 && !selectedTopics.includes('*')) {
        params.push(...selectedTopics);
      }

      if (knowFilter === '0' || knowFilter === '1') {
        params.push(parseInt(knowFilter));
      }

      txn.executeSql(
        query,
        params,
        (_, res) => {
          const words = [];
          for (let i = 0; i < res.rows.length; i++) {
            const item = res.rows.item(i);
            words.push({
              ...item,
              //   imagePath: `${item.section_img}/${item.topic_img}/${item.img}`, // для зображення
            });
          }
          //   console.log('🎯 Вибрано слів:', words.length);
          setWordData(words); // або інше state-оновлення
        },
        (_, error) => {
          console.log('❌ Помилка вибірки слів:', error);
        },
      );
    });
  };

  // Функція для вибору source картинки з imageMap (GPT)
  const getImageSource = () => {
    const word = wordData[wordIndex];
    if (!word || !word.section_img || !word.topic_img || !word.img) {
      //   return require('../../assets/word.png'); // запасне зображення
      return require('../../assets/WordOnClauds.jpg'); // запасне зображення
    }

    const imgName = word.img.replace('.jpg', '').trim();

    const key = `${word.section_img}/${word.topic_img}/${imgName}`;

    if (imageMap[key]) {
      return imageMap[key]; // готовий require
    } else {
      return require('../../assets/WordOnClauds.jpg'); // запасне зображення
    }
  };

  //Скидання показу команди
  const setVoiceCommand = cmd => {
    isVoiceCommandRef.current = cmd;
    setTimeout(() => {
      isVoiceCommandRef.current = '';
    }, 4000);//4 сек
  };
  const handleCommand = command => {
    switch (command) {
      case 'start': // 🧠 Почати з 0
        if (wordData.length === 0) return;
        // isVoiceCommandRef.current = 'start';
        setVoiceCommand('start'); //Скидання показу команди
        setIsStarted(true);
        setIsRunning(true);
        setWordIndex(0);
        setShowTranslation(false);
        // setIsKnownEffect(2); // для ефекту "я знаю"

        break;
      case 'to_begin': //   🧠 На початок
        if (!isStarted) return; //Вихід
        // isVoiceCommandRef.current = 'to_begin';
        setVoiceCommand('to_begin'); //Скидання показу команди
        setIsStarted(false);
        setIsRunning(false);
        setWordIndex(0);
        setShowTranslation(false);
        break;

      case 'stop': // 🛑 Стоп
        if (!isStarted) return; //Вихід
        // isVoiceCommandRef.current = 'stop';
        setVoiceCommand('stop'); //Скидання показу команди
        setIsRunning(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        break;

      case 'next': // ⏭️ Далі після Стоп
        if (!isStarted) return; //Вихід
        // isVoiceCommandRef.current = 'next';
        setVoiceCommand('next'); //Скидання показу команди
        setIsRunning(true);
        nextWord();
        break;

      case 'repeat': //⏭️ Повторити після Стоп
        if (!isStarted) return; //Вихід
        // isVoiceCommandRef.current = 'repeat';
        setVoiceCommand('repeat'); //Скидання показу команди
        if (timerRef.current) clearTimeout(timerRef.current); // Очистити таймер
        setIsRunning(true);
        // setIsKnownEffect(2); // для ефекту "я знаю"
        break;

      case 'back': // ⏭️ Назад iз stop
        if (!isStarted) return; //Вихід
        // isVoiceCommandRef.current = 'back';
        setVoiceCommand('back'); //Скидання показу команди
        setIsRunning(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        backWord(); // викликаємо функцію переходу назад
        break;

      case 'know': // ✅ Знаю
        if (!isStarted) return; //Вихід
        // isVoiceCommandRef.current = 'know';
        setVoiceCommand('know'); //Скидання показу команди
        getCommandRelatedIndex(); //Функція визначення попереднє чи текуче слово
        updateWord(1); //Зміна в БД
        nextWord();
        break;

      case 'dont_know': // ❌ Не знаю
        if (!isStarted) return; //Вихід
        // isVoiceCommandRef.current = 'dont_know';
        setVoiceCommand('dont_know'); //Скидання показу команди
        getCommandRelatedIndex(); //Функція визначення попереднє чи текуче слово
        updateWord(0); //Зміна в БД
        nextWord();
        break;

      default:
        console.log('handleCommand: невідома команда', command);
    }
  };
  /******************************** */

  const updateWord = knowValue => {
    const index = lastKnowRef.current ? wordIndex - 1 : wordIndex;
    const word = wordData[index];
    // console.log('updateWord:', {index, word, knowValue});
    if (!word) return;

    openDatabase().transaction(tx => {
      tx.executeSql(
        'UPDATE words SET know = ? WHERE id = ?',
        [knowValue, word.id],
        () => console.log(`Оновлено слово ${word.id}: know = ${knowValue}`),
        (_, error) => console.log('Помилка оновлення:', error),
      );
    });
  };

  //== Допоміжні =======================
  //   Оновлена функція оцінки тривалості озвучення:
  const estimateSpeechDuration = text => {
    const words = text.trim().split(/\s+/).length;
    const baseDurationPerWord = 700; // базова тривалість на слово в мілісекундах
    const adjustmentFactor = 0.05; // коефіцієнт корекції для зменшення тривалості при збільшенні кількості слів

    // Обчислення скоригованої тривалості на слово
    const adjustedDurationPerWord =
      baseDurationPerWord * (1 - adjustmentFactor * Math.log10(words + 1));

    // Загальна оцінка тривалості
    return Math.max(words * adjustedDurationPerWord, 500); // мінімальна тривалість 500 мс
  };

  //Функція визначення попереднє чи текуче слово до якого треба віднести розпізнану головову команду(мінус затримка)
  // Скидання lastKnowRef.current = false;
  const getCommandRelatedIndex = () => {
    const now = Date.now();
    const t0 = wordStartTimeRef.current;
    const delta = now - t0;
    // const threshold = 2000; // 2 секунди

    if (delta < delayVoiceCommand) {
      // Встановлюємо true і запускаємо таймер скидання
      if (!lastKnowRef.current) {
        lastKnowRef.current = true;

        // Якщо раніше був таймер, очистимо його
        if (lastKnowTimerRef.current) {
          clearTimeout(lastKnowTimerRef.current);
        }

        lastKnowTimerRef.current = setTimeout(() => {
          lastKnowRef.current = false;
          lastKnowTimerRef.current = null;
          // Тут можна викликати функцію оновлення інтерфейсу, якщо треба
        }, delayVoiceCommand);
      }
    } else {
      // Якщо час перевищено - скидаємо в false і очищуємо таймер
      lastKnowRef.current = false;
      if (lastKnowTimerRef.current) {
        clearTimeout(lastKnowTimerRef.current);
        lastKnowTimerRef.current = null;
      }
    }
  };

  // Велика перша буква у виразі
  function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  //===  //Для пульсації фону мікрофона
  const startPulse = () => {
    // зупиняємо попередню
    pulseAnimation.current?.stop();

    // створюємо нову
    const newAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.5,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    pulseAnimation.current = newAnimation;
    newAnimation.start();
  };

  const stopPulse = () => {
    if (pulseAnimation.current) {
      pulseAnimation.current.stop();
      pulseAnimation.current = null; // важливо!
    }
  };
  //=====================

  // 🔊 Вимова
  const speak = (text, language) => {
    Tts.stop();
    Tts.setDefaultLanguage(language);
    // Tts.setDefaultPitch(1.0); // трохи вищий тембр
    // Tts.setDefaultPitch(0.8); // трохи вищий тембр
    Tts.setDefaultRate(0.5); // трохи повільніше
    Tts.speak(text);
  };
  //== к допоміжні =======================

  //📥 Завантаження слів при зміні параметрів settings (electedTopics, knowFilter)
  useEffect(() => {
    if (selectedTopics && knowFilter) {
      loadWords(); // Викликайте функцію завантаження слів при зміні параметрів
    }
  }, [selectedTopics, knowFilter]); // Залежності, при зміні яких буде викликано useEffect
  useEffect(() => {
    if (isStarted) loadWords(); // Викликайте функцію завантаження слів при зміні параметрів
  }, [isStarted]); // Залежності, при зміні яких буде викликано useEffect

  //== Цикл ==============================
  const backWord = () => {
    setShowTranslation(false);
    if (wordIndex > 0) {
      setWordIndex(prev => prev - 1);
    } else {
      setIsRunning(false);
      ToastAndroid.show('Початок списку слів!', ToastAndroid.LONG);
      speak(startOfWordList, fromLanguage);
    }
  };

  const nextWord = () => {
    setShowTranslation(false);
    if (wordIndex + 1 < wordData.length) {
      setWordIndex(prev => prev + 1);
    } else {
      setIsRunning(false);
      ToastAndroid.show('Кінець списку слів!', ToastAndroid.LONG);
      speak(endOfWordList, fromLanguage);
    }
  };

  //***Сам цикл з затримками
  // 🗣️ Зміна слова і вимова оригінального слова
  //📥Вимова слів з оцінкою тривалості звучання речення estimateSpeechDuration**
  useEffect(() => {
    if (!isRunning || wordData.length === 0 || wordIndex >= wordData.length)
      return;

    const current = wordData[wordIndex];

    // 📌 Зафіксувати час старту слова для визначення куди відносити 'знаю/не знаю'
    wordStartTimeRef.current = Date.now();

    Tts.setDefaultPitch(1.0); // трохи вищий тембр
    speak(current.word, fromLanguage);

    const durationOriginal = estimateSpeechDuration(current.word);

    timerRef.current = setTimeout(() => {
      setShowTranslation(true);
    }, durationOriginal + delayOriginal);

    return () => clearTimeout(timerRef.current);
  }, [wordIndex, isRunning]);

  // 🗣️ Озвучка перекладу
  useEffect(() => {
    if (
      !isRunning ||
      !showTranslation ||
      wordData.length === 0 ||
      wordIndex >= wordData.length
    )
      return;

    const current = wordData[wordIndex];
    // Tts.setDefaultPitch(1.1); // трохи вищий тембр
    speak(current.translation, toLanguage);

    const durationTranslation = estimateSpeechDuration(current.translation);

    // Перша затримка — після першого відтворення перекладу
    timerRef.current = setTimeout(() => {
      if (enableRepeatTranslation) {
        // Tts.setDefaultPitch(0.9); // трохи вищий тембр
        speak(current.translation, toLanguage);

        // ⏱️ Затримка після повторного перекладу
        timerRef.current = setTimeout(() => {
          if (!stopBetweenTranslation) {
            nextWord(); // Перехід до наступного слова без зупинки
          } else {
            setIsRunning(false);
          }
        }, durationTranslation + delayTranslation2);
      } else {
        if (!stopBetweenTranslation) {
          nextWord(); // Перехід до наступного слова без зупинки
        } else {
          setIsRunning(false);
        }
      }
    }, durationTranslation + delayTranslation1);

    return () => clearTimeout(timerRef.current);
    //   }, [showTranslation, isRunning]);
  }, [
    showTranslation,
    isRunning,
    wordIndex,
    // wordData,
    // toLanguage,
    // enableRepeatTranslation,
    // stopBetweenTranslation,
    // delayTranslation1,
    // delayTranslation2, // 👈 додано
  ]);
  //== к цикл ==========================

  // для Voice --------------------------------------------------------
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleVoice = useCallback(
    intent => {
      //   getCommandRelatedIndex(); //Функція визначення попереднє чи текуче слово
      switch (intent) {
        case 'to_begin':
          handleCommand('to_begin');
          break;
        case 'start':
          handleCommand('start');
          break;
        case 'stop':
          handleCommand('stop');
          break;
        case 'repeat':
          handleCommand('repeat');
          break;
        case 'back':
          handleCommand('back');
          break;
        case 'next':
          handleCommand('next');
          break;
        case 'know':
          handleCommand('know');
          break;
        case 'dont_know':
          handleCommand('dont_know');
          break;
        default:
          console.log(`Невідома команда: ${intent}`);
      }
    },
    [handleCommand],
  );


  // -------------------------------






  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        stopAll(); // тут зупиняй все
        navigation.replace('Home');
        return true;
      };

      const sub = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => sub.remove();
    }, []),
  );

  // ===============================================
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: cPageBorderBg,
      }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={cStatusBarBg}
        color={cStatusBarOn}
      />
      {/*  */}
      {!isStarted && <RTopBar pcBg={cTopBarBg} pcOn={cTopBarOn} />}
      {/*  */}

        {/* Body of the page */}
        <View style={styles.bodyPageContainer}>
          
          {/* Words */}
          <View style={[styles.wordsContainer, {flexDirection: flexDir}]}>
            {isStarted ? (
              <>
                {showImg && (
                  // {/* Картинка */}
                  <View
                    style={[
                      styles.wordTextContainer,
                      {
                        flex: 2,
                        backgroundColor: cOutputBg,
                        borderColor: cOutputBorder,
                      },
                    ]}>
                    {/* getImageSource-Функція для вибору source картинки GPT */}
                    <Image source={getImageSource()} style={styles.wordImage} />
                  </View>
                )}
                {/* Оригінал/з урахуванням lastKnowRef  */}
                <View
                  style={[
                    styles.wordTextContainer,
                    {
                      flex: 2,
                      backgroundColor: cOutputBg,

                    },
                  ]}>
                  <Text
                    style={[
                      styles.wordText,
                      {
                        color:
                          wordData[wordIndex].know === 1 ? cKnownText : cPageOn,
                        // color:
                        //   wordData[wordIndex].know === 1
                        //     ? cKnownText
                        //     : wordData[wordIndex].know === 0
                        //     ? cDontKnownText
                        //     : cPageOn,
                      },
                    ]}>
                    {capitalizeFirstLetter(wordData[wordIndex]?.word || '')}
                  </Text>
                </View>

                {/* Переклад */}
                <View
                  style={[
                    styles.wordTextContainer,
                    {
                      flex: 2,
                      backgroundColor: cOutputBg,
                      borderColor: cOutputBorder,
                    },
                  ]}>
                  {showTranslation ? (
                    <Text style={[styles.wordText, {color: cPageOn}]}>
                      {wordData[wordIndex].translation}
                    </Text>
                  ) : (
                    <Text style={[styles.wordText, {color: cPageOn}]}>?</Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <View style={styles.startContaner}>
                  <Text style={{color: cLoadText}}>
                    🎯 Вибрано слів: {wordData.length}
                  </Text>
                  <Text style={{color: cLoadText}}>
                    🎯 Вибрані теми: {getSelectedLabel()}
                    {/* 🎯 Вибрані теми: {selectedTopics} */}
                  </Text>
                  <Text style={{color: cLoadText}}>
                    🎯 Вибрані знання:
                    {knowFilter === '1'
                      ? ' знаю'
                      : knowFilter === '0'
                      ? ' не знаю'
                      : 'Всі'}
                  </Text>
                </View>
                <View style={styles.startContaner}>
                  <Text style={[styles.wordText, {color: cPageOn}]}>
                    Натисніть "Почати"
                  </Text>
                </View>
              </>
            )}
          </View>
          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {buttonList
              .filter(btn => btn.visible)
              .map(btn => (
                <TouchableOpacity
                  key={btn.command}
                  style={[styles.button, buttonColorStyle]}
                  onPress={() => handleCommand(btn.command)}>
                  <Text style={buttonTextStyle}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>

    </View>
  );
};
export default Words;

