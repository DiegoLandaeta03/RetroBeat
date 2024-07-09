import { Box, Text, Image } from '@chakra-ui/react';
import './Song.css'

function Song({ track }) {
    const { name, artists, album, duration_ms, preview_url } = track;
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
    const duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <Box
            id="song"
            display="flex"
            alignItems="center"
            bg="rgba(225, 225, 225, 0.8)"
            borderRadius="10px"
            p="10px"
            mb="0.5em"
            _hover={{
                backgroundColor: 'rgb(225, 225, 225)',
                transform: 'translate3d(0, -2px, 0) scale(1.03)',
                transition: 'all 0.3s ease',
                color: 'black',
                cursor: 'pointer'
            }}
            width="100%"
            maxWidth="600px"
        >
            <Image className="songImage" src={album.images[0].url} alt="Song Image"  width="4em" height="3em"/>
            <Box id="songDetails" ml="1em" flex="1">
                <Text 
                    id="songName" 
                    fontSize="0.8em" 
                    mb="0" 
                    mt="0.1em"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    width="20em"
                >
                    {name}
                </Text>
                <Text 
                    id="artist" 
                    mt="0.4em" 
                    mb="0" 
                    fontSize="0.6em"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    width="20em"
                >
                    {artists.map(artist => artist.name).join(', ')}
                </Text>
                <Text 
                    id="album" 
                    mt="0.4em" 
                    fontSize="0.6em"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    width="20em"
                >
                    {album.name}
                </Text>
            </Box>
            <Box ml="auto" textAlign="center" display="flex" alignItems="center">
                <Box mr={2}>
                    {preview_url ? (
                        <audio controls style={{ width: '6.5em' }}>
                            <source src={preview_url} type="audio/mpeg" />
                        </audio>
                    ) : (
                        <Text id="duration" fontSize="0.6em" mr={3}>Audio not available</Text>
                    )}
                </Box>
                <Text id="duration" fontSize="0.6em">{duration}</Text>
            </Box>
        </Box>
    );
}

export default Song;
