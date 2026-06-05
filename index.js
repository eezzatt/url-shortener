const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('URL shortener API is running.')
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})

const urlDatabase = {}

function generateShortCode(){
    return Math.random().toString(36).substring(2,8)
}

app.post('/shorten', (req, res) => {
    const { url } = req.body

    if (!url) {
        return res.status(400).json({ error: 'URL is required' })
    }

    const shortcode = generateShortCode()
    urlDatabase[shortcode] = url

    res.json({
        shortcode: shortcode,
        shortURL: `http://localhost:3000/${shortcode}`,
        originalURL: url
    })
})

app.get('/:shortcode', (req, res) => {
    const { shortcode } = req.params
    const originalUrl = urlDatabase[shortcode]

    if (!originalUrl) {
        return res.status(404).json({ error: 'Short URL not found' })
    }

    res.redirect(originalUrl)
})