const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

router.use(express.json())

router.get('/', async (req, res) => {
    res.send('Welcome to my app!')
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
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/login', async (req, res) => {
    const { email, username, token } = req.body;

    try {
        const userRecord = await prisma.user.findUnique({
            where: { username }
        });

        if (!userRecord) {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    username
                }
            });

            await prisma.token.create({
                data: {
                    token: token,
                    user: {
                        connect: { id: newUser.id }
                    }
                }
            })
        } else {
            await prisma.token.create({
                data: {
                    token: token,
                    user: {
                        connect: { id: userRecord.id }
                    }
                }
            })
        }
        res.json({ success: true })
    } catch (e) {
        res.status(500).json({ "error": e.message });
    }
})

module.exports = router
