// app/download/page.js

export default function DownloadPage() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
      <h1>Завантажити застосунок RWords</h1>
      <p>Натисніть кнопку нижче, щоб завантажити наш застосунок:</p>

      <a
        href="https://github.com/didoshakra/rwords/releases/download/v1.0.1/rwords.apk"
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