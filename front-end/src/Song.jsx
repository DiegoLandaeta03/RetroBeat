import { useRef, useState } from 'react';
import { Box, Text, Image, IconButton } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import './Song.css';

function Song({ track, onPlay, location, onAdd, onRemove }) {
    const { name, artists, album, duration_ms, preview_url } = track;
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
    const duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    const audioRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleAudioPlay = () => {
        if (audioRef.current) {
            onPlay(audioRef.current);
        }
    };

    return (
        <Box
            id="song"
            display="flex"
            alignItems="center"
            bg="rgba(225, 225, 225, 0.8)"
            borderRadius="10px"
            p="10px"
            mb="0.5em"
            color="black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            _hover={{
                backgroundColor: 'rgb(225, 225, 225)',
                transform: 'translate3d(0, -2px, 0) scale(1.03)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
            width="100%"
        >
            <Image className="songImage" src={album.images[0].url} alt="Song Image" width="3em" height="3em" />
            <Box id="songDetails" ml="1em" >
                <Text
                    id="songName"
                    fontSize="0.8em"
                    mb="0"
                    mt="0.1em"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    width="18em"
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
                    width="18em"
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
                    width="18em"
                >
                    {album.name}
                </Text>
            </Box>
            <Box ml="6em" textAlign="center" display="flex" alignItems="center" position="relative">
                <Box mr="2em">
                    {preview_url ? (
                        <audio ref={audioRef} controls style={{ width: '20em' }} onPlay={handleAudioPlay}>
                            <source src={preview_url} type="audio/mpeg" />
                        </audio>
                    ) : (
                        <Box width="20em">
                            <Text id="duration" fontSize="0.6em">Audio not available</Text>
                        </Box>
                    )}
                </Box>
                <Text id="duration" fontSize="0.6em">{duration}</Text>
            </Box>
            {isHovered && (
                    <IconButton pos="absolute" right="-0.7em"
                        icon={location === 'addSongs' ? <AddIcon /> : <MinusIcon />}
                        onClick={location === 'addSongs' ? onAdd : onRemove}
                    />
                )}
        </Box>
    );
}

export default Song;
