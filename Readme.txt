//Запуск на порт 3002 yarn  dev -p 3002
//===============================================
Застосунок RWords.apk href="https://github.com/didoshakra/rwords/releases/download/v1.0.1/rwords.apk"
Як подивитися список релізів і файлів на GitHub: https://github.com/didoshakra/rwords/releases

*********************************
//--	202507хх Зробив ф-ціонал для RWords
	- Перейшов на Neon(serverBD)
	- Добавив вхід(input) через соц мережі

//--	20250813- Добавл скачування слів з мобільного
//--	20250824- Контрастний напис на картинках у Home     textShadow:
                "-2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.8)",
//--	20250825- Заборона зміни шрифтів браузерами Chrome i Safari///WebView і Chrome показуватимуть однаковий розмір 
        app/globals.css:
            @layer base {
                html {
                    -webkit-text-size-adjust: 100%;
                }
            }

        app/layout.tsx
            export const metadata: Metadata = {
                title: 'Мій сайт',
                description: 'Опис сайту',
                viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
            };