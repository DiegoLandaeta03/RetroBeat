const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3000

const login = require('./routes/login')

app.use(cors())
app.use(express.json())
app.use('/login', login)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})