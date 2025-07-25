// app/download/page.js
import { incrementStat } from "@/app/actions/statsActions"

export default function DownloadPage() {
  // Server Action у компоненті React (як callback)
  async function handleDownload() {
    "use server"
    await incrementStat("app_downloads")
  }
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
      <h1>Завантажити застосунок RWords</h1>
      <p>Натисніть кнопку нижче, щоб завантажити наш застосунок:</p>

      <a
        href="https://github.com/didoshakra/rwords/releases/download/v1.0.1/rwords.apk"
        // href="https://cold1.gofile.io/download/web/ab20dd16-bb7d-4d3c-b4b3-81adabea46b8/rwords.apk"
        // download
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        ⬇️ Завантажити APK
      </a>
    </main>
  )
}