// @/src/hooks/useTable.js
//Визначає slice-масив записів для текучої сторінки і к-сть сторінок: range
"use client"
import { useState, useEffect } from "react"

//Масив сторінок [1,2,3...] в залежності від величини БД і rowsPerPage
const calculateRange = (data, rowsPerPage) => {
  const range = []
  const num = Math.ceil(data.length / rowsPerPage)
  let i = 1
  for (let i = 1; i <= num; i++) {
    range.push(i)
  }
  return range
}

// //Рядки текучої сторінки (.slice-кусок масиву БД)
// const sliceData = (data, page, rowsPerPage) => {
//   return data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
// }

export const TablePageRows = (data, page, rowsPerPage) => {
  console.log("TablePageRows.js")
  const [tableRange, setTableRange] = useState([])
  const [slice, setSlice] = useState([])

  useEffect(() => {
    const range = calculateRange(data, rowsPerPage)
    setTableRange([...range])

    // const slice = sliceData(data, page, rowsPerPage)
    const slice = data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    setSlice([...slice])
  }, [data, setTableRange, page, setSlice, rowsPerPage])

  return { slice, range: tableRange }
}
