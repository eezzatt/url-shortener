import { useState } from "react"

function App() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState(null)

  const handleShorten = async () => {
    setError(null)
    setResult(null)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
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

  const handleLogin = async () => {
    setError(null)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
    }
    else {
      setToken(data.token)
    }
  }

  const handleRegister = async () => {
    setError(null)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ email, password})
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
    }
    else {
      handleLogin()
    }
  }

  return (
    <div>
      {token ? 
        (<div>
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
        </div>) : (
          <div>
            <h1>Login/Register</h1>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
            {error && <p>Error: {error}</p>}
          </div>
        )
      }
    </div>
  )
}

export default App