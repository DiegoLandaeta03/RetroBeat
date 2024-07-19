import React from 'react';
import { Box } from '@chakra-ui/react';
import Node from './Node';
import Edge from './Edge';

const Graph = ({ nodes, edges }) => {
    return (
        <Box style={{ width: '100%', height: '100%' }}>
            {edges.map((edge, index) => {
                const fromNode = nodes.find(node => node.id === edge.from);
                const toNode = nodes.find(node => node.id === edge.to);
                return <Edge key={index} from={fromNode} to={toNode} color={edge.color} />;
            })}
            {nodes.map(node => (
                <Node key={node.id} node={node} />
            ))}
        </Box>
    );
};

export default Graph;