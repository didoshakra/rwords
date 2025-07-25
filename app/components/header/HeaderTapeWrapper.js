// HeaderTapeWrapper.js//Створимо обгортку HeaderTapeWrapper.js, яка буде серверним компонентом — він отримає статистику і передасть її в HeaderTape.
import HeaderTape from "./HeaderTape"
import { getStats } from "@/app/actions/statsActions"

export default async function HeaderTapeWrapper() {
  const stats = await getStats() // Server action
  return <HeaderTape stats={stats} />
}
