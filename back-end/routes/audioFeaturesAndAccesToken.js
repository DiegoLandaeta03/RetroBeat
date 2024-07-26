const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        return [];
    }
};

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

module.exports = {
    fetchAudioFeatures,
    getAccessToken
};