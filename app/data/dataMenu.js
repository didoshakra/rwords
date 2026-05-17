//dataMultilevelMenu.js
//роюоча стара+нова версія меню з ролями

export const headMenu0 = [
  {
    a: "Домашня",
    link: "/",
  },
  {
    a: "Слова",
    link: "/words",
    roles: ["admin", "manager", "user"], // ❗️ admin і manager
  },
  {
    a: "RWords",
    link: "/about_rwords",
  },

  {
    a: "Bідгуки",
    link: "/feedback",
  },
  {
    a: "Блог",
    link: "/blog",
  },
  {
    a: "Про мене1",
    link: "/about",
  },
  {
    a: "Shorts",
    link: "/shorts",
  },
]
export const headMenu = [
  {
    id: 1,
    title: "Домашня",
    url: "/",
  },
  {
    id: 2,
    title: "RWords",
    submenu: [
      {
        id: 1,
        title: "Про RWords",
        url: "/about_rwords",
      },
      {
        id: 2,
        title: "Теми і слова",
        // roles: ["admin", "manager", "user"], // ❗️ admin і manager
        submenu: [
          {
            id: 1,
            title: "Групи тем",
            url: "/words/sections",
          },
          {
            id: 2,
            title: "Теми",
            url: "/words/topics",
          },
          {
            id: 3,
            title: "Слова",
            url: "/words",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Медіа",
    submenu: [
      {
        id: 1,
        title: "Галерея медіа",
        url: "/gallery",
      },
      {
        id: 2,
        title: "Каталог",
        roles: ["admin", "manager", "user"], // ❗️ admin і manager
        submenu: [
          {
            id: 1,
            title: "Автори",
            url: "/pictures/pictures_sections",
          },
          {
            id: 2,
            title: "Теми",
            url: "/pictures/pictures_topics",
          },
          {
            id: 3,
            title: "Каталог медіа",
            url: "/pictures",
          },
        ],
      },
      //   {
      //     id: 2,
      //     title: "Гаталевич",
      //     // roles: ["admin"], // ❗️ Доступ тільки для admin
      //     submenu: [
      //       {
      //         id: 1,
      //         title: "2005р",
      //         // url: "/gatalevich2005",
      //         submenu: [
      //           {
      //             id: 1,
      //             title: "Пейзажі",
      //             // url: "/gatalevich2005",
      //             submenu: [
      //               {
      //                 id: 1,
      //                 title: "Пейзажі",
      //                 // url: "/gatalevich2005",
      //                 submenu: [
      //                   {
      //                     id: 1,
      //                     title: "Пейзажі",
      //                     // url: "/gatalevich2005",
      //                     submenu: [
      //                       {
      //                         id: 1,
      //                         title: "Пейзажі",
      //                         // url: "/gatalevich2005",
      //                         submenu: [
      //                           {
      //                             id: 1,
      //                             title: "Пейзажі",
      //                             url: "/gatalevich2005",
      //                           },
      //                           {
      //                             id: 2,
      //                             title: "Картини",
      //                             url: "/gatalevich2015",
      //                           },
      //                         ],
      //                       },
      //                       {
      //                         id: 2,
      //                         title: "Картини",
      //                         url: "/gatalevich2015",
      //                       },
      //                     ],
      //                   },
      //                   {
      //                     id: 2,
      //                     title: "Картини",
      //                     url: "/gatalevich2015",
      //                   },
      //                 ],
      //               },

      //               {
      //                 id: 2,
      //                 title: "Картини",
      //                 url: "/gatalevich2015",
      //               },
      //             ],
      //           },
      //           {
      //             id: 2,
      //             title: "Картини",
      //             url: "/gatalevich2015",
      //           },
      //         ],
      //       },
      //       {
      //         id: 2,
      //         title: "2015р",
      //         url: "/gatalevich2015",
      //       },
      //     ],
      //   },
      //   {
      //     id: 2,
      //     title: "Манюня",
      //     submenu: [
      //       {
      //         id: 1,
      //         title: "2024р",
      //         roles: ["admin", "manager", "user"], // ❗️ admin і manager
      //         url: "/manyunya2024",
      //       },
      //       {
      //         id: 2,
      //         title: "2025р",
      //         roles: ["admin", "manager", "user"], // ❗️ admin і manager
      //         url: "/manyunya2025",
      //       },
      //     ],
      //   },
    ],
  },
  {
    id: 4,
    title: "Блог",
    url: "/blog",
  },
  {
    id: 5,
    title: "Відгуки",
    url: "/feedback",
  },
  {
    id: 6,
    title: "Про мене",
    url: "/about",
  },
  {
    id: 6,
    title: "Shorts",
    url: "/shorts",
    roles: ["admin", "manager"], // ❗️ admin і manager
  },
]
export const menuAdmin = [
  {
    id: 1,
    title: "Адміністрування",
    roles: ["admin"], // ❗️ Доступ тільки для admin
    // skipRoleCheckIfNoUser: true, // 👈 Якщо користувача ще нема (нема БД)
    submenu: [
      {
        id: 1,
        title: "Панель адміністратора",
        roles: ["admin"], // ❗️ Доступ тільки для admin
        // skipRoleCheckIfNoUser: true, // 👈 Якщо користувача ще нема (нема БД)
        submenu: [
          {
            id: 1,
            title: "Панель адміністратора",
            url: "/admin_panel",
          },
          {
            id: 2,
            title: "Створення таблиць БД",
            url: "/admin",
          },
        ],
      },
      {
        id: 2,
        title: "Довідники",
        submenu: [
          {
            id: 1,
            title: "Користувачі",
            roles: ["admin", "manager"], // ❗️ admin і manager
            url: "/users",
          },
          {
            id: 3,
            title: "Відтворення слів(тест)",
            url: "/words_player",
          },
        ],
      },
      {
        id: 3,
        title: "n8n",
        submenu: [
          {
            id: 1,
            title: "YouTube",
            submenu: [
              {
                id: 1,
                title: "Умови використання",
                url: "/n8n/youtube/terms",
              },
              {
                id: 3,
                title: "Політика конфіденційності",
                url: "/n8n/youtube/privacy",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Теми і слова",
    roles: ["admin", "manager", "user"], // ❗️ admin і manager
    submenu: [
      {
        id: 1,
        title: "Групи тем",
        url: "/sections",
      },
      {
        id: 2,
        title: "Теми",
        url: "/topics",
      },
      {
        id: 3,
        title: "Слова",
        url: "/words",
      },
    ],
  },
  {
    id: 3,
    title: "Завантаження",
    roles: ["admin", "manager", "user"], // ❗️ admin і manager
    submenu: [
      {
        id: 1,
        title: "Завантажити застосунок RWords",
        url: "/download",
      },
    ],
  },
]
