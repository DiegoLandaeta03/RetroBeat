const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient()

router.use(express.json())

router.get('/', async (req, res) => {
    const stitches = await prisma.stitch.findMany()
    res.json(stitches)
})

router.get('/:username', async (req, res) => {
    const { username } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            include: {
                stitches: {
                    orderBy: {
                        id: 'desc'
                    }
                }
            }
        })
        res.status(200).json(user.stitches)
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve stitches.' })
    }
})

router.get('/title/:stitchId', async (req, res) => {
    const { stitchId } = req.params;
    try {
        const stitch = await prisma.stitch.findUnique({
            where: {
                id: parseInt(stitchId)
            },
            select: {
                title: true
            }
        });

        if (!stitch) {
            return res.status(404).json({ error: 'Stitch not found.' });
        }

        res.status(200).json({ title: stitch.title });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve stitch.' });
    }
});

router.post('/create', async (req, res) => {
    const { title, username, mood, dance, mix, explore, imageUrl } = req.body

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    const totalPreferences = mood + dance + mix;

    let moodWeight = null;
    let danceWeight = null;
    let mixWeight = null;

    if (totalPreferences == 0) {
        moodWeight = 0;
        danceWeight = 0;
        mixWeight = 0;
    } else {
        moodWeight = mood / totalPreferences;
        danceWeight = dance / totalPreferences;
        mixWeight = 1 - (moodWeight + danceWeight);
    }

    const newStitch = await prisma.stitch.create({
        data: {
            title,
            duration: 0,
            imageUrl,
            mood: moodWeight,
            dance: danceWeight,
            mix: mixWeight,
            explore,
            userId: user.id
        }
    })
    res.json(newStitch)
})

router.patch('/title', async (req, res) => {
    const { stitchId, title } = req.body;

    if (!stitchId || !title) {
        return res.status(400).json({ error: 'stitchId and title are required' });
    }

    try {
        const updatedStitch = await prisma.stitch.update({
            where: {
                id: parseInt(stitchId)
            },
            data: {
                title
            }
        });
        res.json(updatedStitch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stitch.' });
    }
});

router.patch('/image', async (req, res) => {
    const { stitchId, imageUrl } = req.body;

    if (!stitchId || !imageUrl) {
        return res.status(400).json({ error: 'stitchId and imageUrl are required' });
    }

    try {
        const updatedStitch = await prisma.stitch.update({
            where: {
                id: parseInt(stitchId)
            },
            data: {
                imageUrl
            }
        });
        res.json(updatedStitch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stitch.' });
    }
});

router.patch('/exportToSpotify', async (req, res) => {
    const { stitchId, username } = req.body;
    
    if (!stitchId || !username) {
        return res.status(400).json({ error: 'stitchId and username are required' });
    }

    try {
        const stitch = await prisma.stitch.findUnique({
            where: {
                id: parseInt(stitchId)
            },
            include: {
                songs: true
            }
        });

        if (!stitch) {
            return res.status(404).json({ error: 'Stitch not found' });
        }

        const accessToken = 'YOUR_SPOTIFY_ACCESS_TOKEN';

        const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${username}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: stitch.title,
                description: 'Created using SoundStitch',
                public: true
            })
        });

        res.json({ message: 'Exported to Spotify successfully', playlistId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to export to Spotify.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const stitch = await prisma.stitch.findUnique({
            where: { id: parseInt(id) },
            include: {
                songs: true
            }
        });

        if (!stitch) {
            return res.status(404).json({ error: 'Stitch not found' });
        }

        if (stitch.songs && stitch.songs.length > 0) {
            const songDeletionPromises = stitch.songs.map(async (song) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_ADDRESS}/song/${song.id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to delete song ${song.id}`);
                    }

                } catch (error) {
                    throw error;
                }
            });

            await Promise.all(songDeletionPromises);
        }

        const deletedStitch = await prisma.stitch.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json(deletedStitch);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete stitch and associated songs.' });
    }
});

module.exports = router
