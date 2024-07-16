require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000
const login = require('./routes/login')
const spotifyLogin = require('./routes/spotifyLogin')
const stitch = require('./routes/stitchRoutes')
const song = require('./routes/songRoutes')
const recommendation = require('./routes/recommendations')

app.use(cors())
app.use(express.json())
app.use('/auth', spotifyLogin)
app.use('/', login)
app.use('/stitch', stitch)
app.use('/song', song)
app.use('/recommendation', recommendation)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})