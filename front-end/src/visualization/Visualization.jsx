import { Box, Flex, Button, Text, Heading, background } from '@chakra-ui/react';
import Graph from './Graph';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Visualization() {
    const params = useParams();
    const username = params.username;
    const location = useLocation();
    const navigate = useNavigate();
    const stitchId = location.state.stitchId;
    const [clusterData, setClusterData] = useState({ centroids: [], assignments: [] });
    const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
    const [title, setTitle] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const initialZoom = 1;
    const initialTranslation = { x: 0, y: 0 };
    const [zoomLevel, setZoomLevel] = useState(initialZoom);
    const [translation, setTranslation] = useState(initialTranslation);
    const graphContainerRef = useRef(null);

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setStartPos({
            x: event.clientX - translation.x,
            y: event.clientY - translation.y
        });
        event.preventDefault();
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const newX = event.clientX - startPos.x;
            const newY = event.clientY - startPos.y;
            setTranslation({ x: newX, y: newY });
            event.preventDefault();
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const zoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom * 1.1, 2));
    };

    const zoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom / 1.1, 0.5));
    };

    const resetZoomAndTranslation = () => {
        setZoomLevel(initialZoom);
        setTranslation(initialTranslation);
    };

    function calculateClusterPositions(count, centerX, centerY, radius) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            const angle = ((i / count) * 2 * Math.PI) - Math.PI / 2;
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

    function getColorForValence(valence) {
        const colors = [
            { valence: 0.0, color: '#FF0000' }, // Red for very angry or extremely sad
            { valence: 0.25, color: '#800080' }, // Purple for sad
            { valence: 0.5, color: '#0000FF' }, // Blue for neutral or melancholic
            { valence: 0.75, color: '#FFA500' }, // Orange for cheerful
            { valence: 1.0, color: '#CCCC00' }  // Yellow for very happy
        ];

        let lower = colors[0];
        let upper = colors[colors.length - 1];

        for (let i = 0; i < colors.length; i++) {
            if (colors[i].valence <= valence) {
                lower = colors[i];
            }
            if (colors[i].valence >= valence) {
                upper = colors[i];
                break;
            }
        }

        if (lower.valence === upper.valence) {
            return upper.color;
        }

        const range = upper.valence - lower.valence;
        const rangePct = (valence - lower.valence) / range;
        const pctLower = 1 - rangePct;
        const pctUpper = rangePct;

        const color = {
            r: Math.round(parseInt(lower.color.substring(1, 3), 16) * pctLower + parseInt(upper.color.substring(1, 3), 16) * pctUpper),
            g: Math.round(parseInt(lower.color.substring(3, 5), 16) * pctLower + parseInt(upper.color.substring(3, 5), 16) * pctUpper),
            b: Math.round(parseInt(lower.color.substring(5, 7), 16) * pctLower + parseInt(upper.color.substring(5, 7), 16) * pctUpper)
        };

        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    function getValenceDescription(valence) {
        if (valence >= 0.9) {
            return 'Extremely Happy and Euphoric';
        } else if (valence >= 0.8) {
            return 'Very Happy and Energetic';
        } else if (valence >= 0.7) {
            return 'Happy and Lively';
        } else if (valence >= 0.6) {
            return 'Cheerful and Upbeat';
        } else if (valence >= 0.5) {
            return 'Moderately Cheerful';
        } else if (valence >= 0.4) {
            return 'Neutral, neither happy nor sad';
        } else if (valence >= 0.3) {
            return 'Somewhat Melancholic';
        } else if (valence >= 0.2) {
            return 'Melancholic and Sad';
        } else if (valence >= 0.1) {
            return 'Very Sad and Depressed';
        } else {
            return 'Extremely Sad and Depressed';
        }
    }

    function generateClusterData(clusterData, clusterPositions) {
        let globalId = 1;
        let allNodes = [];
        let allEdges = [];

        clusterData.centroids.forEach((centroid, index) => {
            const formattedCentroid = centroid?.toFixed(2) || '0.00';
            const valenceDescription = getValenceDescription(centroid);
            const clusterLabel = `${valenceDescription}`;
            const valenceTooltip = `Valence: ${formattedCentroid}`;
            const { x, y } = clusterPositions[index];
            const songsInCluster = clusterData.assignments.filter(song => song.cluster === index);
            const songPositions = calculateCircularPositions(x, y, 150, songsInCluster.length);
            const clusterColor = getColorForValence(centroid);

            const nodes = [{ id: globalId++, label: clusterLabel, tooltip: valenceTooltip, x, y, isCluster: true, color: clusterColor }];
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
                edges.push({ from: globalId - 1, to: song.id, color: clusterColor });
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
            const clusterPositions = calculateClusterPositions(clusterData.centroids.length, 1000, 1000, 400);
            const { nodes, edges } = generateClusterData(clusterData, clusterPositions);
            setGraphData({ nodes, edges });
        }
    }, [clusterData]);

    const handleNavigateToStitch = () => {
        navigate(`/${username}/create`, { state: { stitchId } });
    }

    useEffect(() => {
        const container = graphContainerRef.current;
        if (container) {
            container.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                container.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [handleMouseDown, handleMouseMove, handleMouseUp]);

    const graphInnerContainerStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translate(${translation.x}px, ${translation.y}px) scale(${zoomLevel})`,
        transformOrigin: 'center center',
        transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
        width: '2000px',
        height: '2000px'
    };

    const graphContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100vw",
        height: "120vh",
        position: "relative",
        overflow: "hidden",
        cursor: isDragging ? 'grabbing' : 'grab'
    };

    return (
        <div className='Visualization'>
            <header>
                <Box bgGradient="radial-gradient(circle, rgba(115, 41, 123, 1) 0%, rgba(0,0,0,1) 86%)">
                    <Navbar username={username} page={"visualization"} />
                    <Flex justifyContent="center">
                        <Heading size='2xl'>{title}</Heading>
                    </Flex>
                    <Flex justifyContent='center' mt='1em'>
                        <Text color='white' fontSize='md' mt='1.5em' textAlign='center' width='80%'>According to Spotify, a value on valence that's closer to 1.0 will describe happy, cheerful or euphoric songs, while a value closer to 0.0 will relate sad, depressed or angry songs. This visualization clusters songs with their closest valence neighbors!</Text>
                    </Flex>
                    <Flex justifyContent="center" mt='1em'>
                        <Button
                            className="navigateToVisualization"
                            bg="white"
                            color="black"
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
                            onClick={handleNavigateToStitch}
                        >
                            <Text fontSize="lg">Back to Stitch</Text>
                        </Button>
                    </Flex>
                    <Flex justifyContent="center" mt="1em">
                        <Button onClick={zoomIn} m={2} colorScheme="white">Zoom In</Button>
                        <Button onClick={zoomOut} m={2} colorScheme="white">Zoom Out</Button>
                        <Button onClick={resetZoomAndTranslation} m={2} colorScheme="white">Reset</Button>
                    </Flex>
                </Box>
            </header>
            <main>
                <Box className="graph" style={graphContainerStyle}>
                    <Box style={graphInnerContainerStyle}>
                        <Box ref={graphContainerRef} style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                            <Graph nodes={graphData.nodes} edges={graphData.edges} />
                        </Box>
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