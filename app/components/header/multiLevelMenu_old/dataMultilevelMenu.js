//dataMultilevelMenu.js
export const menuAdmin = [
  {
    id: 1,
    title: "Адміністрування",
    submenu: [
      {
        id: 1,
        title: "Робота з БД",
        submenu: [
          {
            id: 1,
            title: "Створення таблиць БД",
            url: "/admin",
          },

        ],
      },
    ],
    submenu: [
      {
        id: 2,
        title: "Довідники",
        submenu: [

          {
            id: 1,
            title: "Користувачі",
            url: "/users",
          },
          {
            id: 2,
            title: "Реєстрація",
            url: "/auth",
          },
          {
            id: 3,
            title: "Блог",
            url: "/blog",
          },
        ],
      },
    ],
  },
]
export const menuDocuments = [
  {
    id: 1,
    title: "Документи",
    submenu: [
      {
        id: 2,
        title: "Продажі",
        submenu: [
          {
            id: 3,
            title: "Товарні чеки (doc_check_head)",
            url: "/shop/docs/doc_check_head",
          },
        ],
      },
    ],
  },
]
export const menuBig = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "examples",
    // url: "/examples/next_ui/table_all_case",
    submenu: [
      {
        id: 3,
        title: "table",
        // url: "/others",
        submenu: [
          {
            id: 4,
            title: "table_case",
            url: "/examples/next_ui/table_all_case",
          },
          {
            id: 5,
            title: "examples",
            url: "/examples",
          },
          {
            id: 6,
            title: "Backend",
            submenu: [
              {
                id: 7,
                title: "Table_All_Case",
                url: "/examples/next_ui/table_all_case",
              },
              {
                id: 8,
                title: "PHP/examples",
                url: "/examples",
              },
              {
                id: 9,
                title: "web/others ",
                // url: "/others",
                submenu: [
                  {
                    id: 10,
                    title: "Frontend/examples",
                    url: "frontend/examples",
                  },
                  {
                    id: 11,
                    title: "Backend",
                    submenu: [
                      {
                        id: 12,
                        title: "NodeJS/ebout",
                        url: "/ebout",
                      },
                      {
                        id: 13,
                        title: "PHP/ebout",
                        url: "/ebout",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 14,
        title: "examples",
        url: "/examples",
      },
      {
        id: 15,
        title: "Others/others",
        // url: "/others",
      },
      {
        id: 16,
        title: "web/others ",
        // url: "/others",
        submenu: [
          {
            id: 17,
            title: "Frontend/others",
            url: "/others",
          },
          {
            id: 18,
            title: "Backend",
            submenu: [
              {
                id: 19,
                title: "NodeJS/examples",
                url: "/examples",
              },
              {
                id: 20,
                title: "PHP/",
                url: "/examples",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 21,
    title: "About/about",
    url: "/about",
    submenu: [
      {
        id: 22,
        title: "Who we are/about",
        url: "/about",
      },
      {
        id: 23,
        title: "Our values/about",
        url: "/about",
      },
    ],
  },
]
