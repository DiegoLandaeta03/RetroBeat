import { Box } from '@chakra-ui/react';

const Edge = ({ from, to, color }) => {
    const nodeSize = 5 * 16;
    const shadowPadding = 12;
    const nodeRadius = nodeSize / 2 + shadowPadding;

    const startX = from.x + nodeSize / 2;
    const startY = from.y + nodeSize / 2;
    const endX = to.x + nodeSize / 2;
    const endY = to.y + nodeSize / 2;

    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;

    const adjustedStartX = startX + unitX * nodeRadius;
    const adjustedStartY = startY + unitY * nodeRadius;
    const adjustedEndX = endX - unitX * nodeRadius;
    const adjustedEndY = endY - unitY * nodeRadius;

    const newDx = adjustedEndX - adjustedStartX;
    const newDy = adjustedEndY - adjustedStartY;
    const newLength = Math.sqrt(newDx * newDx + newDy * newDy);
    const angle = Math.atan2(newDy, newDx) * 180 / Math.PI;

    return (
        <Box position="absolute" left={`${adjustedStartX}px`} top={`${adjustedStartY}px`}>
            <svg width={`${newLength}px`} height="3px" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '0 0' }}>
                <line x1="0" y1="1.5" x2={newLength} y2="1.5" stroke={color} strokeWidth="3" />
            </svg>
        </Box>
    );
};

export default Edge;