const express = require('express');
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const router = express.Router();
const prisma = new PrismaClient();

router.use(express.json());

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

function getValenceFeatures(audioFeatures) {
    const valenceFeatures = [];
    audioFeatures.forEach(feature => {
        const songId = feature.uri.split(':').pop();
        const valenceValue = feature.valence;
        valenceFeatures.push({ id: songId, valence: valenceValue });
    });
    return valenceFeatures;
}

async function fetchAndProcessAudioFeatures(songs, accessToken) {
    const features = await fetchAudioFeatures(songs, accessToken);
    const valenceFeatures = getValenceFeatures(features);
    return valenceFeatures;
}

function euclideanDistance(a, b) {
    return Math.abs(a - b);
}

// Calculates mean of valence value of a cluster
function calculateMean(cluster) {
    let sum = 0;
    for (let i = 0; i < cluster.length; i++) {
        sum += cluster[i].valence;
    }
    return sum / cluster.length;
}

// Initializes first centroid from one random song and then for the rest find the largest distance between a song and existing centroid
// in order to obtain better initial centroids (K++ means clustering)# of Centroids = # of Clusters
function initializeCentroids(songs, numClusters) {
    let centroids = [];

    centroids.push(songs[Math.floor(Math.random() * songs.length)].valence);

    for (let i = 1; i < numClusters; i++) {
        let distances = songs.map(song => {
            let minDistance = Math.min(...centroids.map(centroid =>
                Math.pow(song.valence - centroid, 2)));
            return minDistance;
        });

        let totalDistance = 0;
        for (let j = 0; j < distances.length; j++) {
            totalDistance += distances[j]
        }

        let randomValue = Math.random() * totalDistance;
        let runningSum = 0;

        for (let j = 0; j < distances.length; j++) {
            runningSum += distances[j];
            if (runningSum > randomValue) {
                centroids.push(songs[j].valence);
                break;
            }
        }
    }

    return centroids;
}

// Finds the distance between each song's valence value and the valence value of the centroids using Euclidean formula then associates song with closest centroid
function assignSongsToCentroids(songs, centroids) {
    return songs.map(song => {
        const distances = centroids.map(centroid => euclideanDistance(song.valence, centroid));
        const closestCentroidIndex = distances.indexOf(Math.min(...distances));
        return { id: song.id, valence: song.valence, cluster: closestCentroidIndex };
    });
}

// Finds new centroid based on mean valence value of songs in the cluster
function updateCentroids(assignments, numClusters) {
    const newCentroids = [];
    for (let i = 0; i < numClusters; i++) {
        const clusterSongs = assignments.filter(song => song.cluster === i);
        newCentroids[i] = calculateMean(clusterSongs);
    }
    return newCentroids;
}

function kMeans(songs, numClusters) {
    let centroids = initializeCentroids(songs, numClusters);
    let assignments = [];
    let iterations = 0;
    let maxIterations = 100;

    while (iterations < maxIterations) {
        let newAssignments = assignSongsToCentroids(songs, centroids);
        let newCentroids = updateCentroids(newAssignments, numClusters);

        if (JSON.stringify(newCentroids) === JSON.stringify(centroids)) {
            assignments = newAssignments;
            break;
        }

        centroids = newCentroids;
        iterations++;
    }

    return { centroids, assignments };
}

async function fetchSongInfo(songId) {
    try {
        const songInfo = await prisma.song.findUnique({
            where: { uri: `spotify:track:${songId}` }
        })

        return songInfo;
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get song info.' })
    }
}

// Creates array of JSONS song info saved to database with the cluster they belong to
async function addClusterToSong(songs, clusteringResult) {
    const enrichedAssignments = await Promise.all(clusteringResult.assignments.map(async (assignment) => {
        const songInfo = await fetchSongInfo(assignment.id);
        return { ...assignment, ...songInfo };
    }));
    return {
        centroids: clusteringResult.centroids,
        assignments: enrichedAssignments
    };
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

        const valenceFeatures = await fetchAndProcessAudioFeatures(stitch.songs, accessToken);
        const numClusters = Math.ceil(stitch.songs.length / 3);
        const clusteringResult = kMeans(valenceFeatures, numClusters);
        const clustersWithTrackInfo = await addClusterToSong(stitch.songs, clusteringResult);
        res.status(200).json(clustersWithTrackInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve clusters.' });
    }
});

module.exports = router;
