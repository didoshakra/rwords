//Тінь на весь екран  bg-black/30

export default function BackShadow({ setDrawerOpen }) {
  return (
    <div
      className="bg-eclipseBg fixed inset-0 z-20"
      aria-hidden="true"
      onClick={(e) => setDrawerOpen(false)}
    ></div>
  );
}
