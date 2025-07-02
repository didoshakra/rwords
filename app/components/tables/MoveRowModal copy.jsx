// MoveRowModal.jsx////   Для модалки стрілок переміщення рядків
function MoveRowModal({ open, onClose, moveInfo, moveSelectedRow }) {
  if (!open || !moveInfo) return null

  const { idx, total } = moveInfo

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-xl p-6 min-w-[320px] max-w-md shadow-xl flex flex-col items-center gap-4 max-h-[40vh] overflow-auto mb-4">
        <div className="font-bold text-lg">
          Рядок {idx + 1} із {total}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => moveSelectedRow("up")}
            disabled={idx === 0}
            className={`flex items-center gap-2 px-4 py-2 border rounded ${
              idx === 0
                ? "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            Вгору
          </button>
          <button
            onClick={() => moveSelectedRow("down")}
            disabled={idx === total - 1}
            className={`flex items-center gap-2 px-4 py-2 border rounded ${
              idx === total - 1
                ? "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            Вниз
          </button>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Готово
        </button>
      </div>
    </div>
  )
}

export default MoveRowModal

