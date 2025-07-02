// components/TableView.js
//Групування але недобре Types і Users
import React, { useState, useMemo, useCallback } from "react"


export default function TableView({
  data,
  setData,
  columns,
  title,
  onAdd,
  onEdit,
  onDelete,
  onImport,
  onTranslate,
  translate,
  sectionId,
  sectionName,
  beforeSectionName = "Секція",
  sortField = "pn",
}) {
  const [selectedIds, setSelectedIds] = useState([])

  // Для групування
  const groupedData = useMemo(() => {
    if (!sectionId || !sectionName) return [{ title: null, items: data }]
    const map = {}
    data.forEach((item) => {
      const key = item[sectionId]
      if (!map[key]) map[key] = { title: `${beforeSectionName}: ${item[sectionName]}`, items: [] }
      map[key].items.push(item)
    })
    return Object.values(map)
  }, [data, sectionId, sectionName, beforeSectionName])

  // Вибір рядків
  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }
  const selectAll = () => setSelectedIds(data.map((d) => d.id))
  const clearSelection = () => setSelectedIds([])

  const renderCell = useCallback((item, col) => {
    const value = item[col.accessor]
    if (col.type === "know") return value ? "👍" : ""
    if (col.type === "boolean") return value ? "✔" : ""
    if (col.type === "date") return value ? new Date(value).toLocaleDateString() : "-"
    if (col.type === "integer") return value != null ? Math.floor(value) : "-"
    if (col.type === "number") return value != null ? value.toFixed(2) : "-"
    return value
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
          {onAdd && selectedIds.length === 0 && (
            <button onClick={onAdd} className="bg-blue-600 text-white px-3 py-1 rounded">
              ➕ Додати
            </button>
          )}
          {onImport && selectedIds.length === 0 && (
            <button onClick={onImport} className="bg-purple-600 text-white px-3 py-1 rounded">
              📂 Імпорт
            </button>
          )}
          {onTranslate && selectedIds.length === 0 && (
            <button
              onClick={onTranslate}
              className={`px-3 py-1 rounded text-white ${translate ? "bg-red-600" : "bg-indigo-600"}`}
            >
              {translate ? "⏸ Зупинити" : "▶️ Переклад"}
            </button>
          )}

          {selectedIds.length === 1 && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(data.find((d) => d.id === selectedIds[0]))}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  ✏️ Редагувати
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(data.find((d) => d.id === selectedIds[0]))}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  🗑️ Видалити
                </button>
              )}
            </>
          )}

          {selectedIds.length > 1 && onDelete && (
            <button onClick={() => onDelete(selectedIds)} className="bg-red-600 text-white px-3 py-1 rounded">
              🗑 Видалити вибрані
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <span>📄 {data.length}</span>
        <button
          onClick={() => (selectedIds.length === data.length ? clearSelection() : selectAll())}
          className="border px-2 py-1 rounded"
        >
          {selectedIds.length === data.length ? "☑ Зняти всі" : "☐ Виділити всі"}
        </button>
        {selectedIds.length > 0 && <span className="text-blue-700">Виділено: {selectedIds.length}</span>}
      </div>

      <div className="border rounded overflow-auto max-h-[500px]">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="p-2 border text-left" style={{ width: col.width }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupedData.map((group, idx) => (
              <React.Fragment key={idx}>
                {group.title && (
                  <tr className="bg-gray-200">
                    <td colSpan={columns.length} className="p-2 font-semibold">
                      {group.title}
                    </td>
                  </tr>
                )}
                {group.items
                  .sort((a, b) => (a[sortField] ?? 0) - (b[sortField] ?? 0))
                  .map((item) => (
                    <tr
                      key={item.id}
                      className={`cursor-pointer ${selectedIds.includes(item.id) ? "bg-yellow-100" : ""}`}
                      onClick={() => toggleSelect(item.id)}
                    >
                      {columns.map((col) => (
                        <td key={col.accessor} className="p-2 border" style={col.styleCell}>
                          <span style={col.styleCellText}>{renderCell(item, col)}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
