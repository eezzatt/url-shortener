const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('./db')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'})
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const result  = await pool.query (
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
            [email, passwordHash]
        )

        const token = jwt.sign(
            { userId: result.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.json({ token })
    }
    catch (err) {
        console.log(err)
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already registered' })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required'})
        }

        const result = await pool.query (
            'SELECT * FROM users WHERE email = $1 ',
            [email]
        )

        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const validPassword = await bcrypt.compare(password, user.password_hash)

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res.json({ token })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = router