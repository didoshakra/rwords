//https://dev.to/ultroneoustech/creating-multiple-themes-in-tailwind-css-and-nextjs-2e98
//changeTheme, яка приймає рядок теми як аргумент і застосовує його як атрибут даних до елемента HTML
export const changeTheme = (theme) => {
  document.querySelector("html")?.setAttribute("data-theme", theme);
};