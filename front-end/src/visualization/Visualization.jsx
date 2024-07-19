import { Box, Flex, Button } from '@chakra-ui/react';
import Graph from './Graph';
import Navbar from '../Navbar';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function Visualization() {
    const params = useParams();
    const username = params.username;
    const [zoomLevel, setZoomLevel] = useState(1);

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

    function generateClusterData(clusterId, clusterLabel, centerX, centerY, songCount, radius) {
        const clusterColor = getRandomColor();
        const songPositions = calculateCircularPositions(centerX, centerY, radius, songCount);
        const nodes = [{ id: clusterId, label: clusterLabel, x: centerX, y: centerY, isCluster: true, color: clusterColor }];
        const edges = [];

        songPositions.forEach((pos, index) => {
            const songId = clusterId * 100 + index + 1;
            nodes.push({ id: songId, label: `Song ${index + 1}`, x: pos.x, y: pos.y, color: clusterColor });
            edges.push({ from: clusterId, to: songId, color: 'white' });
        });

        return { nodes, edges };
    }

    function addInterClusterEdges(nodes, edges) {
        const song1 = nodes.find(node => node.label === 'Song 1' && node.id > 100 && node.id < 200);
        const song3 = nodes.find(node => node.label === 'Song 3' && node.id > 200 && node.id < 300);
        if (song1 && song3) {
            edges.push({
                from: song1.id,
                to: song3.id,
                color: 'red'
            });
        }
    }

    const clusterPositions = calculateClusterPositions(3, 1000, 1000, 200);
    let globalId = 1;
    let allNodes = [];
    let allEdges = [];
    clusterPositions.forEach((pos, index) => {
        const clusterData = generateClusterData(globalId++, `Cluster ${index + 1}`, pos.x, pos.y, 5, 70);
        allNodes = allNodes.concat(clusterData.nodes);
        allEdges = allEdges.concat(clusterData.edges);
    });
    addInterClusterEdges(allNodes, allEdges);
    return (
        <div className='Visualization'>
            <header>
                <Navbar username={username} page={"visualization"} />
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
                    overflow="hidden"
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
                        <Graph nodes={allNodes} edges={allEdges} />
                    </Box>
                </Box>
            </main>
        </div>
    );
}
export default Visualization;