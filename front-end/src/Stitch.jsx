import { Heading, Box, Flex, Image, Text, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Stitch({ stitch, username, deleteStitch }) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleEdit = (stitchId) => () => {
        navigate(`/${username}/create`, { state: { stitchId } });
    };

    return (
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            variant='elevated'
            borderRadius='md'
            bgColor='white'
            color='black'
            boxShadow='md'
            overflow='hidden'
            transition='transform 0.2s'
            _hover={{
                transform: 'scale(1.05)',
                cursor: 'pointer',
                boxShadow: 'lg',
            }}
            onClick={handleEdit(stitch.id)}
            position="relative"
        >
            <Image
                src={stitch.imageUrl}
                alt='Stitch Cover Image'
                objectFit='cover'
                borderTopRadius='md'
                width='100%'
                height='70%'
            />
            <Box p={4}>
                <Heading size='md' mb={2} whiteSpace="nowrap" width="7.5em" overflow="hidden" textOverflow="ellipsis">{stitch.title}</Heading>
                <Flex align="center">
                    <Text fontSize='sm' color='black' mr={2}>Created by {username}</Text>
                    {isHovered && (
                        <IconButton
                            icon={<DeleteIcon />}
                            onClick={deleteStitch(stitch.id)}
                            position="absolute"
                            right={2}
                            bottom={2}
                            bg="black"
                            color="white"
                            _focus={{ boxShadow: 'none' }}
                            _active={{ boxShadow: 'none', bg: 'white', color: 'black' }}
                            _hover={{
                                opacity: 1,
                                backgroundSize: 'auto',
                                transform: 'translate3d(0, -0.5px, 0) scale(1.01)'
                            }}/>
                    )}
                </Flex>
            </Box>
        </Box>
    );
}

export default Stitch;