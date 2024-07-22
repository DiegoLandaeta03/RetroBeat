import { Box, Image, Text } from '@chakra-ui/react';

const Node = ({ node }) => {
    return (
        <Box
            position="absolute"
            left={`${node.x}px`}
            top={`${node.y}px`}
            width="50px"
            height="50px"
            borderRadius="50%"
            backgroundColor={node.isCluster ? node.color : 'transparent'}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            userSelect="none"
        >
            {node.isCluster ? (
                <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
                </Box>
            ) : (
                <Image
                    src={node.imageUrl}
                    alt={node.label}
                    boxSize="100%"
                    objectFit="cover"
                />
            )}
            <Text color="white" fontSize="xs" mt={node.isCluster ? 0 : 2} textAlign="center">
                {node.label}
            </Text>
        </Box>
    );
};

export default Node;