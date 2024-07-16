const express = require('express');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

const getAccessToken = async (userId) => {
    const token = await prisma.token.findFirst({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return token ? token.token : null;
};

const fetchStitchAverages = async (songs, access_token) => {
    const songIds = songs.map(song => (song.uri).split(':').pop());
    const stringOfIds = songIds.join(',');
    try {
        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${encodeURIComponent(stringOfIds)}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const audioData = await response.json();
    } catch (error) {
        console.error(error);
    }
};

const fetchRecommendations = async (songs, access_token) => {
    const lastSongIds = songs.map(song => (song.uri).split(':').pop()).slice(-5);
    const stringOfIds = lastSongIds.join(',');
    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=${stringOfIds}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const recommendData = await response.json();
        const recommendations = recommendData.tracks;
        const recommendIds = recommendations.map(track => (track.uri).split(':').pop());
        return recommendIds;
    } catch (error) {
        console.error(error);
    }
};

router.get('/:stitchId', async (req, res) => {
    try {
        const stitchId = parseInt(req.params.stitchId);
        const stitch = await prisma.stitch.findUnique({
            where: {
                id: stitchId
            },
            include: {
                songs: {
                    orderBy: {
                        id: 'asc'
                    }
                }
            }
        });

        if (!stitch) {
            return res.status(404).json({ error: 'Stitch not found' });
        }

        const userId = stitch.userId;
        const access_token = await getAccessToken(userId);

        if (!access_token) {
            return res.status(401).json({ error: 'Access token not found' });
        }

        const recommendations = await fetchRecommendations(stitch.songs, access_token);
        const features = await fetchStitchAverages(stitch.songs, access_token);
        res.status(200).json(recommendations);
        res.status(200).json(features)
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve stitch songs.' });
    }
});

module.exports = router;
