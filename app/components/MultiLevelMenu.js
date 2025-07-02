//MultiLevelMenu.js
// Не працюють кольори по рівнях
"use client"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"

// const colorLevel = {
//   0: "#000000",
//   1: "#0906f7",
//   2: "#0a5ced",
//   3: "#0969ae",
//   4: "#0c6998",
//   5: "#0e6955",
// }
const colorLevel = {
  0: "text-level0",
  1: "text-level1",
  2: "text-level2",
  3: "text-level3",
  4: "text-level4",
  5: "text-level5",
}

// const MenuItem = ({ item, depth = 0, setDrawerOpen }) => {
//   const [open, setOpen] = useState(false)
//   const ref = useRef()

//   useEffect(() => {
//     const handler = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handler)
//     return () => document.removeEventListener("mousedown", handler)
//   }, [])

//   const hasSubmenu = item.submenu && item.submenu.length > 0
//   const colorStyle = { color: colorLevel[depth] || "#000000" }

//   return (
//     // paddingLeft: `${depth * 5}px`-відступ у рівнях кратне 5px
//     <li ref={ref} className="py-1" style={{ paddingLeft: `${depth * 5}px` }}>
//       {/* <ul className={`${dropdownClass0} ${dropdownClass} ${dropdown ? "block" : "hidden"} ${colorStyle}`}> */}

//       <div
//         // style={colorStyle}
//         // className={`flex items-center justify-between cursor-pointer hover:text-blue-600 ${colorStyle}`}
//         className={`flex items-center justify-between cursor-pointer hover:text-blue-600 ${
//           colorLevel[depth] || "text-black"
//         }`}
//         // className="flex items-center cursor-pointer hover:text-blue-600"
//         onClick={() => {
//           if (hasSubmenu) setOpen((prev) => !prev)
//           else setDrawerOpen?.(false)
//         }}
//       >
//         {item.url ? (
//           <Link href={item.url} className="no-underline" onClick={() => setDrawerOpen?.(false)}>
//             {item.title}
//           </Link>
//         ) : (
//           <span>{item.title}</span>
//         )}

//         {hasSubmenu && (
        //   <span className="ml-2">
        //     {open ? (
        //       <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
        //         <polyline points="6 15 12 9 18 15" />
        //       </svg>
        //     ) : (
        //       <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
        //         <polyline points="6 9 12 15 18 9" />
        //       </svg>
        //     )}
        //   </span>
//         )}
//       </div>

//       {hasSubmenu && (
//         <ul className={`ml-2 transition-all duration-300 ease-in ${open ? "block" : "hidden"}`}>
//           {item.submenu.map((sub, idx) => (
//             <MenuItem key={`${depth}-${idx}-${sub.title}`} item={sub} depth={depth + 1} setDrawerOpen={setDrawerOpen} />
//           ))}
//         </ul>
//       )}
//     </li>
//   )
// }
const MenuItem = ({ item, depth = 0, setDrawerOpen }) => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ❗️Перевірка ролі
  if (item.roles && (!user || !item.roles.includes(user.role))) {
    return null // 🔒 приховати, якщо роль не підходить
  }

  const hasSubmenu = item.submenu && item.submenu.length > 0

  return (
    <li ref={ref} className="py-1" style={{ paddingLeft: `${depth * 5}px` }}>
      <div
        className={`flex items-center  cursor-pointer hover:text-blue-600 text-level${depth}`}
        onClick={() => {
          if (hasSubmenu) setOpen((prev) => !prev)
          else setDrawerOpen?.(false)
        }}
      >
        {item.url ? (
          <Link href={item.url} className="no-underline" onClick={() => setDrawerOpen?.(false)}>
            {item.title}
          </Link>
        ) : (
          <span>{item.title}</span>
        )}
        {hasSubmenu && (
          <span className="ml-2">
            {open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <polyline points="6 15 12 9 18 15" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </span>
        )}
      </div>

      {hasSubmenu && (
        <ul className={`ml-2 transition-all duration-300 ease-in ${open ? "block" : "hidden"}`}>
          {item.submenu.map((sub, idx) => (
            <MenuItem key={`${depth}-${idx}-${sub.title}`} item={sub} depth={depth + 1} setDrawerOpen={setDrawerOpen} />
          ))}
        </ul>
      )}
    </li>
  )
}

const MultiLevelMenu = ({ items, setDrawerOpen }) => {
  return (
    <ul className="text-sm  text-level0 text-level1 text-level2 text-level3 text-level4 text-level5">
      {items.map((item, index) => (
        <MenuItem key={`menu-${index}`} item={item} depth={0} setDrawerOpen={setDrawerOpen} />
      ))}
    </ul>
  )
}

export default MultiLevelMenu
