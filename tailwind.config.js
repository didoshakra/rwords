/** @type {import('tailwindcss').Config} */
module.exports = {
  //   screens: {'sm':'640px','md': '768px','lg': '1024px',xl': '1280px',2xl': '1536px',}
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // >>> ДОДАЙ СЮДИ <<<
  safelist: [
    "bg-levelBg0",
    "bg-levelBg1",
    "bg-levelBg2",
    "bg-levelBg3",
    "bg-levelBg4",
    "bg-levelBg5",

    "text-levelHover",
    "text-level0",
    "text-level1",
    "text-level2",
    "text-level3",
    "text-level4",
    "text-level5",
  ],
  // <<< ДОДАНО >>>

  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // levelHover: "#2563eb",
        levelHover: "#f64532",
        // level0: "#f64532",
        // level1: "#82AE46",
        // level2: "#13ff11",
        // level3: "#ac00ca",
        // level4: "#fcd34d",
        // level5: "#0e6955",
        // levelBg0: "#0e6955",
        // levelBg1: "#fcd34d",
        // levelBg2: "#ac00ca",
        // levelBg3: "#13ff11",
        // levelBg4: "#82AE46",
        // levelBg5: "#f64532",
        level0: "var(--color-pCol9)",
        level1: "var(--color-pCol8)",
        level2: "var(--color-pCol7)",
        level3: "var(--color-pCol6)",
        level4: "var(--color-pCol5)",
        level5: "var(--color-pCol4)",
        levelBg0: "var(--color-pCol5)",
        levelBg1: "var(--color-pCol4)",
        levelBg2: "var(--color-pCol3)",
        levelBg3: "var(--color-pCol2)",
        levelBg4: "var(--color-pCol1)",
        levelBg5: "var(--color-pCol0)",

        //
        infoMsg: "#4f46e5",
        infoMsgD: "#8c92f8",
        errorMsg: "#dc2626",
        errorMsgD: "#dc2626",
        eclipseBg: "rgba(36, 12, 12, 0.3)", //Затемнення екрану
        linkOn: "#2563eb", //bg-blue-600 "#1d4ed8",//bg-blue-700
        linkOnD: "#2563eb", //bg-blue-600

        // page --------------------------------------------
        pBg: "var(--color-pCol1)",
        pBgD: "#334155",
        pOn: "var(--color-pCol8)",
        pOnD: "var(--color-pCol3)",
        // page1 --------------------------------------------
        pBg1: "var(--color-pCol2)",
        pBg1D: "#1e293b",
        pOn1: "var(--color-pCol8)",
        pOn1D: "var(--color-pCol0)",

        //  картка -------------------------------
        kBg: "var(--color-pCol2)",
        kOn: "var(--color-pCol8)",
        kBor: "var(--color-pCol3)",

        // картка1 -------------------------------
        k1Bg: "var(--color-pCol3)",
        k1On: "var(--color-pCol8)",
        k1Bor: "var(--color-pCol4)",

        // headTape --------------------------------------------
        hTapeBg: "var(--color-pCol6)",
        hTapeOn: "var(--color-pCol0)",
        hTapeBgD: "#0f172a", //--color-pCol9: #0f172a;

        // form
        fOn: "var(--color-pCol8)",
        fOnD: "var(--color-pCol2)",
        fBg: "var(--color-pCol1)",
        fBgD: "#64748b", //  --color-pCol6: #475569;

        fBor: "var(--color-pCol4)",
        fBorD: "#64748b", //--color-pCol5:#64748b;
        // fBorHovD: "var(--color-pCol1)",
        fBorHov: "var(--color-pCol13)",
        fBorFocus: "var(--color-pCol13)",
        // fBorFocusD: "var(--color-pCol11)",
        // fBgHov: "var(--color-pCol2)",
        // fBgHovD: "var(--color-pCol1)",

        // head --------------------------------------------
        hOn: "var(--color-pCol8)",
        hOnD: "var(--color-pCol2)",
        hOnHov: "var(--color-pCol6)",
        hOnHovD: "var(--color-pCol3)",
        hBg: "var(--color-pCol3)",
        hBgD: "#1e293b", //--color-pCol8: #1e293b;
        hBgHov: "var(--color-pCol3)",
        hBgHovD: "var(--color-pCol6)",
        hBorder: "var(--color-pCol3)",
        hBorderD: "#64748b", //--color-pCol5:#64748b;
        hOn: "var(--color-pCol8)",
        hOnD: "var(--color-pCol2)",
        hOnHov: "var(--color-pCol6)",
        hOnHovD: "var(--color-pCol2)",
        //
        h1On: "var(--color-pCol10)",
        h1OnD: "var(--color-pCol10)",
        //
        h2On: "var(--color-pCol11)",
        h2OnD: "var(--color-pCol11)",
        //
        h3On: "var(--color-pCol9)",
        h3OnD: "var(--color---color-pCol1)",

        // bottom:
        btBg: "var(--color-pCol5)",
        btBgD: "var(--color-pCol5)",
        btBgHov: "var(--color-pCol4)",
        btOn: "var(--color-pCol0)",
        btOnD: "var(--color-pCol0)",
        //
        bt1Bg: "var(--color-pCol10)",
        bt1BgD: "var(--color-pCol6)",
        bt1BgHov: "var(--color-pCol4)",
        bt1On: "var(--color-pCol0)",
        bt1OnD: "var(--color-pCol0)",

        //  Випадаючоге меню
        drawDropMenuBg: "var(--color-pCol1)",
        drawDropMenuBgD: "#1e293b", //--color-pCol8: #1e293b;
        drawDropHr: "var(--color-pCol3)", // Лінії розмежування
        drawDropHrD: "var(--color-pCol3)", // --color-pCol6: #475569;

        // iconT /Table,Form,Card,
        // iconT: "#f64532",
        // iconTD: "#f64532",
        // iconInfo: "#138611",
        // iconInfoD: "#13ff11",

        // table (th) ------------------------------------------
        tabThOn: "var(--color-pCol8)",
        tabThOnD: "var(--color-pCol4)",
        tabThBg: "var(--color-pCol2)",
        tabThBgD: "#1e293b", //--color-pCol8: #1e293b;
        tabThBorder: "var(--color-pCol3)",
        tabThBorderD: "#64748b", //--color-pCol5:#64748b;

        // table/tr Рядки
        tabTrOn: "#000000",
        tabTrOnD: "#FFFFFF",
        tabTrBg: "#FFFFFF",
        tabTrBgD: "rgb(55 65 81)",
        tabTrBgHov: "var(--color-pCol2)",
        tabTrBgHovD: "var(--color-pCol5)",
        tabTrBgSel: "var(--color-pCol3)", //Вибрані рядки
        tabTrBgSelHov: "var(--color-pCol5)",
        // tabTr1 -------------------------------
        tabTr1On: "var(--color-pCol8)",
        tabTr1OnD: "var(--color-pCol2)",
        tabTr1Bg: "var(--color-pCol0)",
        tabTr1BgD: "rgb(55 65 81)",
        tabTr1BgHov: "var(--color-pCol2)",
        tabTr1BgHovD: "var(--color-pCol5)",
        tabTr1BgSel: "var(--color-pCol4)", //Вибрані рядки
        tabTr1BgSelHov: "var(--color-pCol3)",
        // tabTr2 -------------------------------
        tabTr2On: "var(--color-pCol8)",
        tabTr2OnD: "var(--color-pCol4)",
        tabTr2Bg: "var(--color-pCol1)",
        tabTr2BgD: "rgb(55 65 81)",
        tabTr2BgHov: "var(--color-pCol2)",
        tabTr2BgHovD: "var(--color-pCol5)",

        // tabTrBorder: "var(--color-pCol1)",
        // tabTrBorderD: "#dde2eb",
        // tabTrBgEve: "var(--color-pCol0)",
        // tabTrBgEveD: "#4b5563",
      },
    },

    keyframes: {
      slideHome: {
        "0%": {
          opacity: 100,
        },
        "45%": {
          opacity: 100,
        },
        "55%": {
          opacity: 0,
        },

        "100%": {
          opacity: 0,
        },
      },
      slideHome1: {
        "0%": {
          opacity: 100,
        },
        "100%": {
          opacity: 0,
        },
      },

      drawerDroop: {
        "0%": {
          transform: "translateХ(0)",
        },
        "100%": {
          transform: "translateY(200px)",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          ".bg-focus-important": {
            "background-color": "#2563eb !important",
          },
        },
        ["responsive", "hover"]
      )
    },
  ],
}
