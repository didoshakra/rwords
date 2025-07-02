//https://medium.com/@aalam-info-solutions-llp/excel-import-in-next-js-50359f3d7f66
import { useEffect, useState,  useRef } from "react"


export default function ProductInsertPasgreSQL(dJson) {
  const [insertRows, setInsertRows] = useState(0) //number of inserted records

  const containerStyles = {
    //    height: 20,
    width: "100%",
    backgroundColor: "#6a1b9a",
    color: "#FFFF",
    //    backgroundColor: "#e0e0de",
    borderRadius: 10,
    margin: 0,
    paddingLeft: 10,
  }
  //****************************************************************** */

//   useEffect(() => {
//     toPostgreSQL(dJson)
//   }, [dJson])

  //--- Добавалення(create) запису(запит)
  const rowAdd = async (formData) => {
    // console.log("Product.js/rowAdd/formData=", formData)
    // console.log("Product.js/rowAdd/JSON.stringify(formData)=", JSON.stringify(formData))
    const url = "/api/shop/references/d_product/insert" //працює
    const options = {
      method: "POST",
      body: JSON.stringify(formData), //Для запитів до серверів використовувати формат JSON
      headers: {
        "Content-Type": "application/json", //Вказує на тип контенту
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      // якщо HTTP-статус в диапазоне 200-299
      const resRow = await response.json() //повертає тіло відповіді json
      //   console.log("Product.js/rowAdd/try/esponse.ok/resRow=", resRow)
      //   alert(`Запис успішно добавленo ${resRow}`)
      return resRow
    } else {
      const err = await response.json() //повертає тіло відповіді json
      //   alert(`Запис не добавлено! ${err.message} / ${err.stack}`)
      console.log(`Product.js/rowAdd/try/else/\ Помилка при добавленні запису\ ${err.message} / ${err.stack} `)
    }
  }

  //Загрузка даних в PjstgreSQL
  const toPostgreSQL = (dJson) => {
    // console.log("d_product.js/toPostgreSQL//dJson=", dJson)
    let insertZap = 0
    try {
      //   dataJson.forEach((row) => {
      dJson.forEach((row) => {
        rowAdd(row)
        setInsertRows(insertRows + 1)

        console.log("d_produt.js/toPostgreSQL/insertRows=", insertRows)
      })
    } finally {
      console.log("d_product.js/toPostgreSQL/finally/insertRows.current=", insertRows.current)
      alert(`finally:Добавленo ${insertZap}`)
      //   insertRows.current=0
    }
    return insertZap
  }
  //************************************************** */
  return <div style={containerStyles}>Імпортовано: {insRows} зап.</div>
}
