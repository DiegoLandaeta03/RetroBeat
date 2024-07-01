const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const saltRounds = 14
const router = express.Router()
const prisma = new PrismaClient()

router.use(express.json())

router.get('/', async (req, res) => {
    res.send('Welcome to my app!')
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' })
}

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token
    if (!refreshToken) {
        return res.sendStatus(401)
    }

    try {
        const storedToken = await prisma.token.findUnique({
            where: {
                token: refreshToken
            }
        })
        if (!storedToken) {
            return res.sendStatus(403) // Forbidden if token is not found in database
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            const accessToken = generateAccessToken({ username: user.username })
            res.json({ accessToken: accessToken })
        })

    } catch (error) {
        console.error("Error handling refresh token:", error)
        return res.sendStatus(500)
    }
})

router.delete('/logout', async (req, res) => {
    const { token } = req.body
    if (!token) {
        return res.status(400).json({ error: "Token is required" })
    }

    try {
        const deletedToken = await prisma.token.delete({
            where: {
                token: token
            }
        })
        if (deletedToken) {
            return res.status(204).send()
        } else {
            return res.status(404).json({ error: "Token not found" })
        }
    } catch (error) {
        console.error("Logout error:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/create', async (req, res) => {
    const { email, username, password } = req.body;
    bcrypt.hash(password, saltRounds, async function (err, hashed) {
        try {
            const encryptedUser = await prisma.user.create({
                data: {
                    email,
                    username,
                    hashedPassword: hashed
                }
            });
            const accessToken = generateAccessToken({ username: username })
            const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET)
            await prisma.token.create({
                data: {
                    token: refreshToken,
                    user: {
                        connect: { id: encryptedUser.id }
                    }
                }
            })

            res.json({ success: true, accessToken: accessToken, refreshToken: refreshToken })
        } catch (e) {
            res.status(500).json({ "error": e.message });
        }
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userRecord = await prisma.user.findUnique({
        where: { username }
    });

    if (!userRecord) {
        return res.status(404).json({ error: "User not found" });
    }

    bcrypt.compare(password, userRecord.hashedPassword, async (err, result) => {
        if (err) {
            console.error("Error comparing password:", err)
            return res.status(500).json({ error: "Internal server error" })
        }
        if (result) {
            const accessToken = generateAccessToken({ username: username })
            const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET)
            await prisma.token.create({
                data: {
                    token: refreshToken,
                    user: {
                        connect: { id: userRecord.id }
                    }
                }
            })

            res.json({ success: true, accessToken: accessToken, refreshToken: refreshToken })
        } else {
            res.status(500).json({ success: false, message: 'Not authenticated' });
        }
    });
})

module.exports = router
