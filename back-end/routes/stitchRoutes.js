const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

router.use(express.json())

router.get('/', async (req, res) => {
    const stitches = await prisma.stitch.findMany()
    res.json(stitches)
})

router.get('/user', async (req, res) => {
    const { username } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            },
            include: { stitches: true }
        })
        res.status(200).json(user.stitches)
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve stitches.' })
    }
})

router.post('/create', async (req, res) => {
    const { title, username } = req.body

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    const newStitch = await prisma.stitch.create({
        data: {
            title,
            duration: 0,
            mood: 0,
            dance: 0,
            mixability: 0,
            genre: "",
            userId: user.id
        }
    })
    res.json(newStitch)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const deletedStitch = await prisma.stitch.delete({
            where: { id: parseInt(id) }
        })
        res.status(200).json(deletedStitch)
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete stitch.' })
    }
})

module.exports = router
