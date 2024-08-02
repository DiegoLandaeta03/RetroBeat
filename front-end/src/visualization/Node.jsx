import { Box, Image, Text, Tooltip } from '@chakra-ui/react';

const Node = ({ node }) => {
    const isCluster = node.isCluster;
    const nodeStyle = isCluster ? {
        width: "5em",
        height: "5em",
        backgroundColor: node.color,
        boxShadow: `0 0 20px 10px ${node.color}`,
        borderRadius: "50%",
        transition: "all 0.3s ease-in-out",
        transformOrigin: 'center center',
        _hover: {
            transform: 'scale(1.2)',
            boxShadow: `0 0 25px 12px ${node.color}`,
        }
    } : {
        width: "5em",
        height: "auto",
        transition: "all 0.3s ease-in-out",
        transformOrigin: 'center center',
        boxShadow: '0 0 25px 12px #171616',
        _hover: {
            transform: 'scale(1.2)'
        }
    };

    const clusterTextStyle = {
        color: "white",
        fontSize: "xs",
        mt: "0.5em",
        textAlign: "center",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
        width: "100%",
    };

    const songTextStyle = {
        color: "white",
        fontSize: "xs",
        mt: "0.5em",
        textAlign: "center",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    };

    const content = isCluster ? (
        <Tooltip label={node.tooltip} hasArrow>
            <Text {...clusterTextStyle}>
                {node.label}
            </Text>
        </Tooltip>
    ) : (
        <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Image
                src={node.imageUrl}
                alt={node.label}
                boxSize="100%"
                objectFit="cover"
            />
            <Text {...songTextStyle}>
                {node.label}
            </Text>
        </Box>
    );

    return (
        <Box
            id={`node-${node.id}`}
            position="absolute"
            left={`${node.x}px`}
            top={`${node.y}px`}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            userSelect="none"
            {...nodeStyle}
        >
            {content}
        </Box>
    );
};

export default Node;