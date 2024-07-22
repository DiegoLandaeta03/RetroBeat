import { Box, Flex, Button, Text, Heading } from '@chakra-ui/react';
import Graph from './Graph';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Visualization() {
    const params = useParams();
    const username = params.username;
    const location = useLocation();
    const navigate = useNavigate();
    const stitchId = location.state.stitchId;
    const [zoomLevel, setZoomLevel] = useState(1);
    const [clusterData, setClusterData] = useState({ centroids: [], assignments: [] });
    const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
    const [title, setTitle] = useState('');

    const zoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom * 1.1, 2));
    };
    const zoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom / 1.1, 0.5));
    };
    const resetZoom = () => {
        setZoomLevel(1);
    };

    function getRandomColor() {
        const letters = '01234567';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    function calculateClusterPositions(count, centerX, centerY, radius) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            positions.push({ x, y });
        }
        return positions;
    }

    function calculateCircularPositions(centerX, centerY, radius, count) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            positions.push({ x, y });
        }
        return positions;
    }

    function generateClusterData(clusterData, clusterPositions) {
        let globalId = 1;
        let allNodes = [];
        let allEdges = [];

        clusterData.centroids.forEach((centroid, index) => {
            const formattedCentroid = clusterData.centroids[index]?.toFixed(2) || '0.00';
            const clusterLabel = `Valence: ${formattedCentroid}`;
            const { x, y } = clusterPositions[index];
            const songsInCluster = clusterData.assignments.filter(song => song.cluster === index);
            const songPositions = calculateCircularPositions(x, y, 100, songsInCluster.length);
            const clusterColor = getRandomColor();

            const nodes = [{ id: globalId++, label: clusterLabel, x, y, isCluster: true, color: clusterColor }];
            const edges = [];

            songsInCluster.forEach((song, idx) => {
                nodes.push({
                    id: song.id,
                    label: song.name,
                    x: songPositions[idx].x,
                    y: songPositions[idx].y,
                    color: clusterColor,
                    imageUrl: song.album.images[0].url
                });
                edges.push({ from: globalId - 1, to: song.id, color: 'white' });
            });

            allNodes = allNodes.concat(nodes);
            allEdges = allEdges.concat(edges);
        });

        return { nodes: allNodes, edges: allEdges };
    }

    useEffect(() => {
        const getClusterData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/clusters/${stitchId}`);
                const data = await response.json();
                setClusterData(data);
            } catch (error) {
                console.error('Error getting clusters:', error);
            }
        };

        const fetchStitchName = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/title/${stitchId}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch stitch name');
                }

                const data = await response.json();
                setTitle(data.title || 'Untitled');
            } catch (error) {
                console.error('Error fetching stitch name:', error);
            }
        };

        fetchStitchName();
        getClusterData();
    }, []);

    useEffect(() => {
        if (clusterData.centroids.length > 0) {
            const clusterPositions = calculateClusterPositions(clusterData.centroids.length, 1000, 1000, 250);
            const { nodes, edges } = generateClusterData(clusterData, clusterPositions);
            setGraphData({ nodes, edges });
        }
    }, [clusterData]);

    const handleToStitch = () => {
        navigate(`/${username}/create`, { state: { stitchId } });
    }


    return (
        <div className='Visualization'>
            <header>
                <Navbar username={username} page={"visualization"} />
                <Flex justifyContent="center" mt="1em">
                    <Heading size='2xl'>{title}</Heading>
                </Flex>
                <Flex justifyContent="center">
                    <Button
                        className="navigateToVisualization"
                        bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                        color="white"
                        width="11em"
                        mt="1em"
                        _focus={{ boxShadow: 'none', bg: 'white', color: 'black' }}
                        _active={{ boxShadow: 'none' }}
                        _hover={{
                            opacity: 1,
                            backgroundSize: 'auto',
                            boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                            transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                        }}
                        onClick={handleToStitch}
                    >
                        <Text fontSize="lg">Back to Stitch</Text>
                    </Button>
                </Flex>
                <Flex justifyContent='center'>
                    <Text color='white' fontSize='md' mt='1.5em' textAlign='center' width='70%'>According to Spotify, a value on valence that's closer to 1.0 will describe happy, cheerful or euphoric songs 🥳😺💃, while a value closer to 0.0 will relate sad, depressed or angry songs 😡😿💔. This visualization clusters songs with their closest valence neighbors!</Text>
                </Flex>
                <Flex justifyContent="center" mt="1em">
                    <Button onClick={zoomIn} m={2} colorScheme="white">Zoom In</Button>
                    <Button onClick={zoomOut} m={2} colorScheme="white">Zoom Out</Button>
                    <Button onClick={resetZoom} m={2} colorScheme="white">Reset Zoom</Button>
                </Flex>
            </header>
            <main>
                <Box
                    className="graph"
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    width="100vw"
                    height="100vh"
                    position="relative"
                    overflow="auto" 
                >
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        style={{
                            transform: `translate(-50%, -50%) scale(${zoomLevel})`,
                            transformOrigin: 'center center',
                            transition: 'transform 0.2s',
                            width: '2000px',
                            height: '2000px'
                        }}
                    >
                        <Graph nodes={graphData.nodes} edges={graphData.edges} />
                    </Box>
                </Box>
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}
export default Visualization;