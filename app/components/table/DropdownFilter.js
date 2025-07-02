import { useState } from "react"
import DroopFifterForm from "./DroopFifterForm"

export default function DropdownFilter({
  filterData, //Дані фільтру(тільки ті поля по яких задано )
  setFilterData,
  setIsDropdownFilter,
  styleTableText,
  applyFilters, //Застосувати фільтр
  deleteFilterAll,
  filteredState, //Що у фільтрі є непусті записи
  setFilteredState, //Що у фільтрі є непусті записи
}) {
  const [isDropdownFilterForm, setIsDropdownFilterForm] = useState(false)
  const [filterDataRow, setFilterDataRow] = useState([]) //Рядок, що коригується(в DropdownFilterForm)

  //--- Selected / Записуємо селект(true/false) в _selected роточого масиву(workData)
  const editRows = (e) => {
    // console.log("DropdownFilter.js/editRows/e.target=", e.target);
    const nRow = Number(e.target.id) //id-Це DOM(<td id="1"> Я йому присвоюю значення БД=_nrow)

    //Щукаємо рядок _nrow === nRow
    let tempData = [...filterData] //Копія робочого масиву обєктів
    //  //https://www.geeksforgeeks.org/how-to-modify-an-objects-property-in-an-array-of-objects-in-javascript/
    const row = tempData.find((obj) => obj._nrow === nRow) //Шукажмо запис по _nrow=nRow
    if (row) {
      setIsDropdownFilterForm(true)
      setFilterDataRow(row)
    }
    //
    //--------------------------------------------------------------
  }

  return (
    <div
      style={{ "--sW": "calc(100vw - 10px)" }} //
      className="absolute left-0 mx-1 z-10 max-w-[--sW] rounded-lg drop-shadow-md border border-fBorder bg-fBg dark:border-fBorderD dark:bg-fBgD md:left-auto w-full md:w-[40%] p-2"
    >
      <div className="mt-1 px-1 w-full overflow-auto">
        <div className="h-7 flex justify-between items-center mb-2">
          {filteredState != 0 ? (
            <div className="flex justify-start space-x-1 items-center">
              <button
                className="h-6 w-6 align-middle  hover:bg-fBgHov dark:hover:bg-fBgHovD rounded-full border border-fBorder dark:border-fBorderD"
                onClick={() => deleteFilterAll()}
                title="Очистити всі"
              >
                {/* смітник */}
                <svg
                  // className="h-6 w-6 text-iconT dark:text-iconTD"
                  className="h-6 w-6 text-blue-600 "
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" /> <line x1="4" y1="7" x2="20" y2="7" />{" "}
                  <line x1="10" y1="11" x2="10" y2="17" /> <line x1="14" y1="11" x2="14" y2="17" />{" "}
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
              <button
                className="leading-6 m-1 px-2 text-center   rounded-md  bg-gradient-to-r from-red-400 to-red-700 text-white drop-shadow-md hover:from-red-300 hover:to-red-600  shadow-[-2px_-2px_13px_rgb(255,255,255,0.6),2px_2px_3px_rgba(0,0,0,0.6)] active:shadow-[2px_2px_3px_rgb(255,255,255,0.6),-2px_-2px_3px_rgba(0,0,0,0.6)]"
                onClick={() => applyFilters()}
                title="Застосувати  фільтри"
              >
                {/* Enter
                <svg
                  className="h-6 w-6 text-iconT dark:text-iconTD"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <polyline points="9 10 4 15 9 20" /> <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                </svg> */}
                <h1 className={`{styleTableText} font-bold uppercase `}>Застосувати</h1>
              </button>
            </div>
          ) : (
            "-"
          )}
          {/* <input
            className="leading-6 m-1 px-2 text-center   rounded-md  bg-gradient-to-r from-red-400 to-red-700 text-white drop-shadow-md hover:from-red-300 hover:to-red-600  shadow-[-2px_-2px_13px_rgb(255,255,255,0.6),2px_2px_3px_rgba(0,0,0,0.6)] active:shadow-[2px_2px_3px_rgb(255,255,255,0.6),-2px_-2px_3px_rgba(0,0,0,0.6)]"
            type="button"
            value="Застосувати фільтр"
          /> */}
          {/* <button
            className="leading-6 m-1 px-2 text-center   rounded-md  bg-gradient-to-r from-red-400 to-red-700 text-white drop-shadow-md hover:from-red-300 hover:to-red-600  shadow-[-2px_-2px_13px_rgb(255,255,255,0.6),2px_2px_3px_rgba(0,0,0,0.6)] active:shadow-[2px_2px_3px_rgb(255,255,255,0.6),-2px_-2px_3px_rgba(0,0,0,0.6)]"
            value="Застосувати фільтр"
          >
            Застосувати фільтр
          </button> */}

          <h1 className={`{styleTableText} font-bold uppercase text-center text-fText dark:text-fTextD `}>Фільтри</h1>

          <button
            className=" h-6 w-6 hover:bg-fBgHov dark:hover:bg-fBgHovD rounded-full border border-fBorder dark:border-fBorderD"
            onClick={(e) => setIsDropdownFilter(false)}
            title="Вийти без збереження"
          >
            {/* скасувати */}
            <svg
              className="h-6 w-6 text-iconT dark:text-iconTD"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokewinejoin="round"
            >
              {" "}
              <line x1="18" y1="6" x2="6" y2="18" /> <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* <div className="max-w-ful overflow-auto"> */}
        <div className=" w-full">
          {/* <table className="table-fixed"> */}
          <table className="max-w-full table-auto overflow-auto w-[100%] ">
            {/* <thead className="bg-gray-300  text-left uppercase  text- dark:bg-gray-500 dark:text-white"> */}
            <thead className="bg-fBg  text-left uppercase text-fText dark:bg-fBgD  dark:text-fTextD">
              <tr>
                {/* <th className={`${styleTableText} w-[10%]`}>Поле</th> */}
                <th className={`${styleTableText}`}>Поле</th>
                {/* <th>Ключ</th> */}
                {/* <th className={`${styleTableText} w-24`}>&gt;=&lt;</th> */}
                <th className={`${styleTableText} text-iconT`}>=</th>
                <th className={`${styleTableText}`}> Фільтр1 </th>
                <th className={`${styleTableText} text-iconT`}>&&</th>
                <th className={`${styleTableText} text-iconT`}>=</th>
                <th className={`${styleTableText}`}>Фільтр2</th>
              </tr>
            </thead>
            <tbody>
              {filterData.map((row, index) => (
                <tr
                  id={row._nrow}
                  key={index}
                  className={`${styleTableText} -medium bg-fBg font-normal text-fText hover:text-fTextHov hover:bg-fBgHov dark:bg-fBgD dark:hover:text-fTextHovD dark:text-fTextD dark:hover:bg-fBgHovD `}
                  onClick={(e) => editRows(e)}
                >
                  <td id={row._nrow} className={`font-semibold  whitespace-nowrap`}>
                    {row.name}
                  </td>
                  {/* <td
                id={row._nrow}
                className={`${styleTableText} font-semibold text-fText dark:text-fTextD`}
              >
                {row.accessor}
              </td> */}
                  <td id={row._nrow} className="text-iconT">
                    {row.comparisonFirst}
                  </td>
                  <td id={row._nrow}>
                    {/* <td id={row._nrow} className="whitespace-nowrap"> */}
                    {/* <td id={row._nrow} className={`${row.filterFirst.length < 11 && whitespace - nowrap}`}> */}
                    {row.filterFirst}
                  </td>
                  <td id={row._nrow} className="text-iconT">
                    {row.logical}
                  </td>
                  <td id={row._nrow} className="text-iconT">
                    {row.comparisonTwo}
                  </td>
                  <td id={row._nrow}>{row.filterTwo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Dropdown menu */}
      {isDropdownFilterForm && (
        <DroopFifterForm
          setIsDropdownFilterForm={setIsDropdownFilterForm}
          filterDataRow={filterDataRow}
          filterData={filterData} //масив фільтрів
          setFilterData={setFilterData}
          filteredState={filteredState} //Що у фільтрі є непусті записи
          setFilteredState={setFilteredState} //Що у фільтрі є непусті записи
        />
      )}
    </div>
  )
}
