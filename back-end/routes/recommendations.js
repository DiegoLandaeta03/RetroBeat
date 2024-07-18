const express = require('express');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

const getAccessToken = async (userId) => {
    const token = await prisma.token.findFirst({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return token ? token.token : null;
};

const fetchAudioFeatures = async (songs, accessToken) => {
    const songIds = songs.map(song => (song.uri).split(':').pop());
    const stringOfIds = songIds.join(',');

    try {
        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${encodeURIComponent(stringOfIds)}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
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

async function fetchAndProcessAudioFeatures(songs, accessToken) {
    const features = await fetchAudioFeatures(songs, accessToken);
    const stitchAverages = calculateGlobalFeatureAverages(features);
    const lastSongFeatures = features.length > 0 ? features[features.length - 1] : null;
    return {
        stitchAverages,
        lastSongFeatures
    };
}

function getTonalityScore(lastSongFeatures, currentSongFeatures) {
    const lastSongKey = lastSongFeatures.key;
    const lastSongMode = lastSongFeatures.mode;
    const currentSongKey = currentSongFeatures.key;
    const currentSongMode = currentSongFeatures.mode;

    // Transition to same key and mode (ex: F minor to F minor)
    if (lastSongKey == currentSongKey && lastSongMode == currentSongMode) {
        return 1;
    }

    // Transtion up or down in current circle on Camelot System (ex: D-flat minor to A-flat minor or F-sharp minor)
    if (lastSongMode == currentSongMode) {
        if (currentSongKey == (lastSongKey + 5) % 12 || currentSongKey == ((lastSongKey - 5) % 12 + 12) % 12) {
            return 1;
        }
        return 0;
    }

    // Moving either to inside or outside circle on Camelot System (ex: A-flat major to F-minor)
    if (lastSongMode == 0) {
        if (currentSongMode == 1 && currentSongKey == (lastSongKey + 3) % 12) {
            return 0.75;
        }
    } else {
        if (currentSongMode == 0 && currentSongKey == ((lastSongKey - 3) % 12 + 12) % 12) {
            return 0.5;
        }
    }

    return 0;
}

function gradingAlgorithm(lastSongFeatures, recommendationAudioFeatures, stitchAverages, moodWeight, danceWeight, mixWeight) {
    try {
        const scores = new Map();
        recommendationAudioFeatures.forEach(feature => {
            const recommendId = feature.uri.split(':').pop();
            const valenceScore = 1 - Math.abs(stitchAverages.valence - feature.valence) / stitchAverages.valence;
            const energyScore = 1 - Math.abs(stitchAverages.energy - feature.energy) / stitchAverages.energy;
            const instrumentScore = 1 - Math.abs(stitchAverages.instrumentalness - feature.instrumentalness) / stitchAverages.instrumentalness;
            const totalMoodScore = (valenceScore + energyScore + instrumentScore) / 3;
            const danceScore = feature.danceability;
            const tempoScore = 1 - Math.abs(lastSongFeatures.tempo - feature.tempo) / lastSongFeatures.tempo;
            const toneScore = getTonalityScore(lastSongFeatures, feature);
            const totalMixScore = (tempoScore + toneScore) / 2;
            const totalScore = (totalMoodScore * moodWeight) + (danceScore * danceWeight) + (totalMixScore * mixWeight)
            scores.set(recommendId, totalScore);
        });

        const sortedScores = Array.from(scores).sort((a, b) => b[1] - a[1]);
        const sortedIds = sortedScores.map(entry => entry[0]);
        return sortedIds;
    } catch (error) {
        console.error("Error in gradingAlgorithm:", error);
    }
}

const fetchRecommendations = async (songs, accessToken, exploreWeight) => {
    const lastSongIds = songs.map(song => (song.uri).split(':').pop()).slice(-5);
    const commaSeparatedIds = lastSongIds.join(',');
    const max_popularity = 100 - Math.round(50 * exploreWeight);

    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=100&seed_tracks=${commaSeparatedIds}&max_popularity=${max_popularity}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                console.error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
                return null;
            }
            throw new Error(`API request failed with status ${response.status}`);
        }
        const recommendData = await response.json();
        const trackRecommendations = recommendData.tracks;
        return trackRecommendations;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return null;
    }
};

const fetchRankedTracks = async (songIds, accessToken) => {
    const top20RecommendationIds = songIds.slice(0, 20);
    const commaSeparatedIds = top20RecommendationIds.join(',');
    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks?ids=${commaSeparatedIds}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const trackData = await response.json();
        const tracks = trackData.tracks;
        return tracks;
    } catch (error) {
        console.error(error);
    }
}

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
        const accessToken = await getAccessToken(userId);

        if (!accessToken) {
            return res.status(401).json({ error: 'Access token not found' });
        }

        const recommendationTracks = await fetchRecommendations(stitch.songs, accessToken, stitch.explore);

        if (stitch.mood == 0 && stitch.dance == 0 && stitch.mix == 0) {
            return res.status(200).json(recommendationTracks);
        }

        const { lastSongFeatures, stitchAverages } = await fetchAndProcessAudioFeatures(stitch.songs, accessToken);
        const recommendationAudioFeatures = await fetchAudioFeatures(recommendationTracks, accessToken);
        const rankedRecommendationIds = gradingAlgorithm(lastSongFeatures, recommendationAudioFeatures, stitchAverages, stitch.mood, stitch.dance, stitch.mix);
        const userRecommendedTracks = await fetchRankedTracks(rankedRecommendationIds, accessToken);
        res.status(200).json(userRecommendedTracks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve recommended songs.' });
    }
});

module.exports = router;
