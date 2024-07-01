require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000
const login = require('./routes/login')
const user = require('./routes/user')

app.use(cors())
app.use(express.json())
app.use('/', login)
app.use('/user', user)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})