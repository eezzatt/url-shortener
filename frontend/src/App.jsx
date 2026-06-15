import { useState } from "react"

function App() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleShorten = async () => {
    setError(null)
    setResult(null)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
    }
    else {
      setResult(data.shortURL)
    }
  }

  return (
    <div>
      <h1>URL Shortener</h1>
      <input
        type="text"
        placeholder="Enter a URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleShorten}>Shorten</button>
      {result && <p>Short URL: <a href={result}>{result}</a></p>}
      {error && <p>Error: {error}</p>}
    </div>
  )
}

export default App