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

const fetchAudioFeatures = async (songs, access_token) => {
    const songIds = songs.map(song => (song.uri).split(':').pop());
    const stringOfIds = songIds.join(',');

    try {
        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${encodeURIComponent(stringOfIds)}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const audioData = await response.json();
        return audioData.audio_features;
    } catch (error) {
        console.error(error);
        return [];
    }
};

function calculateGlobalFeatureAverages(features) {
    let totalValence = 0;
    let totalEnergy = 0;
    let totalInstrumentalness = 0;
    let totalCount = 0;

    features.forEach(feature => {
        totalValence += feature.valence;
        totalEnergy += feature.energy;
        totalInstrumentalness += feature.instrumentalness;
        totalCount++;
    });

    const valence = totalCount > 0 ? totalValence / totalCount : 0;
    const energy = totalCount > 0 ? totalEnergy / totalCount : 0;
    const instrumentalness = totalCount > 0 ? totalInstrumentalness / totalCount : 0;

    return {
        valence,
        energy,
        instrumentalness
    };
}

async function fetchAndProcessAudioFeatures(songs, access_token) {
    const features = await fetchAudioFeatures(songs, access_token);
    const averages = calculateGlobalFeatureAverages(features);
    const lastSongFeatures = features.length > 0 ? features[features.length - 1] : null;
    return {
        averages,
        lastSongFeatures
    };
}

function gradingAlgorithm(lastSongFeatures, recommendationAudioFeatures, averages) {
    try {
        const scores = new Map();
        const moodWeight = 0.40;
        const danceWeight = 0.19;
        const mixWeight = 0.41;
        recommendationAudioFeatures.forEach(feature => {
            const recommendId = feature.uri.split(':').pop();
            const tempoScore = 1 - Math.abs(lastSongFeatures.tempo - feature.tempo) / lastSongFeatures.tempo;
            const valenceScore = 1 - Math.abs(averages.valence - feature.valence) / averages.valence;
            const danceScore = feature.danceability;
            const totalScore = (valenceScore * moodWeight) + (danceScore * danceWeight) + (tempoScore * mixWeight)
            scores.set(recommendId, totalScore);
        });

        const sortedScores = Array.from(scores).sort((a, b) => b[1] - a[1]);

        let count = 1;
        sortedScores.forEach(([id, diff]) => {
            count++;
        });
    } catch (error) {
        console.error("Error in gradingAlgorithm:", error);
    }
}

const fetchRecommendations = async (songs, access_token) => {
    const lastSongIds = songs.map(song => (song.uri).split(':').pop()).slice(-5);
    const commaSeparatedIds = lastSongIds.join(',');
    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=40&seed_tracks=${commaSeparatedIds}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const recommendData = await response.json();
        const recommendations = recommendData.tracks;
        return recommendations;
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
        const { lastSongFeatures, averages } = await fetchAndProcessAudioFeatures(stitch.songs, access_token);
        const recommendationAudioFeatures = await fetchAudioFeatures(recommendations, access_token);
        gradingAlgorithm(lastSongFeatures, recommendationAudioFeatures, averages);
        res.status(200).json(recommendationAudioFeatures);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve stitch songs.' });
    }
});

module.exports = router;
