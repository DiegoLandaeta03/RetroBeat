import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Input, FormControl, Heading, Button, Text, useToast } from '@chakra-ui/react';
import Navbar from './Navbar';
import Song from './Song';
import CustomName from './CustomName';
import Footer from './Footer';
import noImage from './assets/Image_not_available.png';

function Create() {
    const params = useParams();
    const location = useLocation();
    const toast = useToast();
    const navigate = useNavigate();
    const username = params.username;
    const [searchOptions, setSearchOptions] = useState([]);
    const [currentStitchSongs, setCurrentStitchSongs] = useState([]);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const stitchId = location.state.stitchId;
    const [deleteId, setDeleteId] = useState('');
    const [nextAllowedRequestTime, setNextAllowedRequestTime] = useState(Date.now());

    const handleSearch = (event) => {
        const song = event.target.value;

        if (!song) {
            setSearchOptions([]);
            return;
        }

        searchSongs(song);
    }

    const searchSongs = async (song) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(song)}&type=track`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const searchData = await response.json();
            if (!searchData.tracks.items.length) {
                throw new Error('Error searching for songs.');
            }
            setSearchOptions(searchData.tracks.items);
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            navigate('/');
        }
    };

    const handleAudioPlay = (audioElement) => {
        if (currentAudio && currentAudio !== audioElement) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        setCurrentAudio(audioElement);
    };

    const updateImage = async (imageUrl) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/image`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stitchId, imageUrl })
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Error updating stitch image",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    };

    const handleAddSong = (track) => {
        const { uri, name, artists, album, duration_ms, preview_url, popularity } = track;

        try {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/song/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    stitchId: stitchId,
                    uri,
                    name,
                    artists,
                    album,
                    duration_ms,
                    preview_url,
                    popularity
                })
            })
                .then(response => response.json())
                .then(data => {
                    getStitchSongs();
                })
        } catch (error) {
            toast({
                title: "Error",
                description: "Error adding song to stitch",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    }

    const getRecommendedSongs = async () => {
        await getStitchSongs();
        if (currentStitchSongs.length == 0) {
            toast({
                description: "Please add your first song to receive recommendations!",
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        const currentTime = Date.now();
        if (currentTime < nextAllowedRequestTime) {
            toast({
                description: "Please wait 15 seconds before requesting recommendations again.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/recommendation/${stitchId}`);
            const recommendedSongs = await response.json();
            setRecommendedSongs(recommendedSongs);
            setNextAllowedRequestTime(currentTime + 15000);
        } catch (error) {
            toast({
                title: "Error",
                description: "Error getting recommendations.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    }

    const getStitchSongs = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/song/${stitchId}`);
            const stitchSongs = await response.json();
            if (stitchSongs.length != 0) {
                const topSongImage = stitchSongs[0].album.images[0].url;
                updateImage(topSongImage);
            } else {
                updateImage(noImage);
            }
            setCurrentStitchSongs(stitchSongs);
        } catch (error) {
            toast({
                title: "Error",
                description: "Error getting songs in stitch",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }

    }

    const handleRemove = (songId) => {
        setDeleteId(songId);
    };

    const finalizeStitch = () => {
        navigate(`/${username}`);
    };

    const handleToVisualization = () => {
        navigate(`/${username}/visualization`, { state: { stitchId } });
    }
    
    useEffect(() => {
        const deleteSong = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/song/${deleteId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error('Failed to delete song');
                }

                setDeleteId('');
                getStitchSongs();
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            }
        };

        if (deleteId) {
            deleteSong();
        } else {
            getStitchSongs();
        }
    }, [deleteId, stitchId, toast]);

    return (
        <Box className='Create'>
            <header>
                <Box bgGradient="radial-gradient(circle, rgba(115, 41, 123, 1) 0%, rgba(0,0,0,1) 86%)">
                    <Navbar username={username} page={"create"} />
                </Box>
            </header>
            <main>
                <Box display="flex" justifyContent="center" textAlign="center" mt="1em">
                    <CustomName stitchId={stitchId} />
                </Box>
                <Box width="100%" display="flex" justifyContent="space-evenly">
                    <Box className="searchSection" color="white" minHeight="100vh" display="flex" flexDirection="column" alignItems="center" flex="1" mt="2em">
                        <Heading as='h3' size='xl'>Add Songs</Heading>
                        <Box textAlign="center" mb={4}>
                            <FormControl mt="1em">
                                <Input
                                    type='text'
                                    onChange={handleSearch}
                                    placeholder='Search for songs...'
                                    focusBorderColor='rgb(83, 41, 140)'
                                />
                            </FormControl>
                        </Box>

                        <Box width='30em' mb='1em'>
                            {searchOptions.slice(0, 3).map((track) => (
                                <Song
                                    key={track.id}
                                    track={track}
                                    onPlay={handleAudioPlay}
                                    location="addSongs"
                                    onAdd={() => handleAddSong(track)}
                                />
                            ))}
                        </Box>

                        <Button
                            bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                            color="white"
                            width="14em"
                            _focus={{ boxShadow: 'none' }}
                            _active={{ boxShadow: 'none' }}
                            _hover={{
                                opacity: 1,
                                backgroundSize: 'auto',
                                boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                                transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                            }}
                            onClick={getRecommendedSongs}
                        >
                            <Text fontSize="lg">Get Recommendations</Text>
                        </Button>

                        <Box width='30em' mt='1em'>
                            {recommendedSongs.slice(0, 5).map((track) => (
                                <Song
                                    key={track.id}
                                    track={track}
                                    onPlay={handleAudioPlay}
                                    location="addSongs"
                                    onAdd={() => handleAddSong(track)}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box mt="2em" display='flex' flexDirection='column' alignItems='center'>
                        <Button
                            className="navigateToVisualization"
                            bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                            color="white"
                            width="11em"
                            mb="1em"
                            _focus={{ boxShadow: 'none', bg: 'white', color: 'black' }}
                            _active={{ boxShadow: 'none' }}
                            _hover={{
                                opacity: 1,
                                backgroundSize: 'auto',
                                boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                                transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                            }}
                            onClick={handleToVisualization}
                        >
                            <Text fontSize="lg">View Visualization</Text>
                        </Button>
                        <Button
                            className="finalizeStitch"
                            bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                            color="white"
                            width="10em"
                            _focus={{ boxShadow: 'none', bg: 'white', color: 'black' }}
                            _active={{ boxShadow: 'none' }}
                            _hover={{
                                opacity: 1,
                                backgroundSize: 'auto',
                                boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                                transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                            }}
                            onClick={finalizeStitch}
                        >
                            <Text fontSize="lg">Finalize Stitch</Text>
                        </Button>

                    </Box>
                    <Box className="stitchSection" color="white" minHeight="100vh" display="flex" flexDirection="column" alignItems="center" flex="1" mt="2em">
                        <Heading as='h3' size='xl'>Current Stitch</Heading>
                        <Box mt="1em" width="30em">
                            {currentStitchSongs.map((song) => (
                                <Song
                                    key={song.id}
                                    track={song}
                                    onPlay={handleAudioPlay}
                                    location="currentStitch"
                                    onRemove={() => handleRemove(song.id)}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </main>
            <footer>
                <Footer />
            </footer>
        </Box>
    )
}

export default Create;
