//dataMultilevelMenu.js
export const headMenu = [
  {
    a: "Домашня",
    link: "/",
  },
  {
    a: "Блог",
    link: "/blog",
  },
  {
    a: "Про нас",
    link: "/about",
  },
  {
    a: "Групи тем",
    link: "/sections",
  },
  {
    a: "Теми",
    link: "/topics",
  },
  {
    a: "Слова_TW",
    link: "/words_tw",
  },
  {
    a: "Слова",
    link: "/words",
  },
  {
    a: "Слова1",
    link: "/words1",
  },
  {
    a: "Слова2",
    link: "/words2",
  },
]
export const menuAdmin = [
  {
    id: 1,
    title: "Адміністрування",
    submenu: [
      {
        id: 1,
        title: "Робота з БД",
        roles: ["admin"], // ❗️ Доступ тільки для admin
        submenu: [
          {
            id: 1,
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
            id: 2,
            title: "Групи тем",
            url: "/sections",
          },
          {
            id: 3,
            title: "Теми",
            url: "/topics",
          },
          {
            id: 4,
            title: "Слова",
            url: "/words",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Налаштування",
    submenu: [
      {
        id: 1,
        title: "Права доступу",
        url: "/roles",
      },
    ],
  },
]
