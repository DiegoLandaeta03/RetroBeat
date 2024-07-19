import { Box } from '@chakra-ui/react';

const Node = ({ node }) => {
    return (
        <Box
            position="absolute"
            left={`${node.x}px`}
            top={`${node.y}px`}
            width="50px"
            height="50px"
            borderRadius="50%"
            backgroundColor={node.color}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            userSelect="none"
        >
            {node.label}
        </Box>
    );
};

export default Node;