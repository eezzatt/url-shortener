const express = require('express')
const app = express()
const pool = require('./db')

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

app.post('/shorten', async (req, res) => {
    try {
        const { url } = req.body

        if (!url) {
            return res.status(400).json({ error: 'URL is required' })
        }

        const shortcode = generateShortCode()
        await pool.query(
            'INSERT INTO urls (shortcode, original_url) VALUES ($1, $2)',
            [shortcode, url]
        )

        res.json({
            shortcode: shortcode,
            shortURL: `http://localhost:3000/${shortcode}`,
            originalURL: url
        })
    }
    catch (err) {
        res.status(500).json({ error: 'Something went wrong' })
    }
    
})

app.get('/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params
        const { rows } = await pool.query(
            'SELECT original_url FROM urls WHERE shortcode = $1',
            [shortcode]
        )

        if (!rows[0]) {
            return res.status(404).json({ error: 'Short URL not found' })
        }

        res.redirect(rows[0].original_url)
    }
    catch (err) {
        res.status(500).json({ error: 'Something went wrong' })
    }
})