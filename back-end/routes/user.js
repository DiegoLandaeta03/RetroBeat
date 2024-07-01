const express = require('express')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

router.use(express.json())

router.get('/:username', authenticateToken, async (req, res) => {
    const username = req.params.username
    const user = await prisma.user.findUnique({
        where: { username }
    });

    res.json({ user })
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err)
            return res.sendStatus(403)
        }

        req.user = user
        next()
    })
}

module.exports = router
