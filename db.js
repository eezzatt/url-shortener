const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'urlshortener',
    password: 'Barcafan10_!',
    port: 5433
})

module.exports = pool