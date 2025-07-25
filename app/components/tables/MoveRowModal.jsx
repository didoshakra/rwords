// MoveRowModal.jsx////   Для модалки стрілок переміщення рядків
function MoveRowModal({ open, onClose, moveInfo, moveSelectedRow }) {
  if (!open || !moveInfo) return null

  const { idx, total } = moveInfo

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-xl p-6 min-w-[320px] max-w-md shadow-xl flex flex-col items-center gap-4 max-h-[40vh] overflow-auto mb-4">
        <div className="flex gap-4">
          <div className="font-bold text-lg">
            Рядок {idx + 1} із {total}
          </div>
          <button
            onClick={() => moveSelectedRow("up")}
            disabled={idx === 0}
            className={`flex items-center gap-2 px-4 py-2 border rounded ${
              idx === 0
                ? "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {/* Стрілка вгору */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
            Вгору
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => moveSelectedRow("down")}
            disabled={idx === total - 1}
            className={`flex items-center gap-2 px-4 py-2 border rounded ${
              idx === total - 1
                ? "bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {/* Стрілка вниз */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l7-7m-7 7l-7-7" />
            </svg>
            Вниз
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {/* Галочка */}
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
    </div>
  )
}

export default MoveRowModal
