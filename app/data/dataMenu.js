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
        skipRoleCheckIfNoUser: true, // 👈 Якщо користувача ще нема (нема БД)
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
            title: "Слова_TW",
            url: "/words_tw",
          },
          {
            id: 4,
            title: "Слова",
            url: "/words",
          },
          {
            id: 4,
            title: "Слова1",
            url: "/words1",
          },
          {
            id: 4,
            title: "Слова2",
            url: "/words2",
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
