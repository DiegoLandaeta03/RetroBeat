const express = require('express')
const router = express.Router()

router.use(express.json())

router.get('/', async (req, res) => {
    res.send('Welcome to my app!')
})


module.exports = router
