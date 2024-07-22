import { Box } from '@chakra-ui/react';

const Edge = ({ from, to, color }) => {
    const startX = from.x + 25;
    const startY = from.y + 25;
    const endX = to.x; 
    const endY = to.y;

    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

    return (
        <Box position="absolute" left={`${startX}px`} top={`${startY}px`}>
            <svg width={`${length}px`} height="2px" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '0 0' }}>
                <line x1="0" y1="0" x2={length} y2="0" stroke={color} />
            </svg>
        </Box>
    );
};

export default Edge;