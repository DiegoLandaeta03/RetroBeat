const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

router.use(express.json())

router.get('/:stitchId', async (req, res) => {
    try {
        const stitchId = parseInt(req.params.stitchId)
        const stitch = await prisma.stitch.findUnique({
            where: {
                id: stitchId
            },
            include: { songs: true }
        })
        res.status(200).json(stitch.songs)
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve stitch songs.' })
    }
})

router.post('/add', async (req, res) => {
    try {
        const { stitchId, uri, title, artist, image, duration, previewUrl, popularity } = req.body

        const newSong = await prisma.song.create({
            data: {
                uri,
                title,
                artist,
                image,
                duration,
                previewUrl,
                popularity,
                stitchId: stitchId
            }
        })
        res.status(200).json(newSong)
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add song.' })
    }
})


router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const deletedSong = await prisma.song.delete({
            where: { id: parseInt(id) }
        })
        res.status(200).json(deletedSong)
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete stitch.' })
    }
})

module.exports = router
