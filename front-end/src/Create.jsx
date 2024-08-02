import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Box, Input, FormControl, Heading, Button, Text, useToast, useDisclosure, Flex, Divider, Center, Spinner } from '@chakra-ui/react';
import Navbar from './Navbar';
import Song from './Song';
import CustomName from './CustomName';
import Footer from './Footer';
import noImage from './assets/Image_not_available.png';
import PreferenceModal from './PreferenceModal';

function Create() {
    const params = useParams();
    const location = useLocation();
    const toast = useToast();
    const navigate = useNavigate();
    const username = params.username;
    const action = params.action;
    const [searchOptions, setSearchOptions] = useState([]);
    const [currentStitchSongs, setCurrentStitchSongs] = useState([]);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [loadingRecommended, setLoadingRecommended] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);
    const stitchId = location.state.stitchId;
    const [deleteId, setDeleteId] = useState('');
    const [nextAllowedRequestTime, setNextAllowedRequestTime] = useState(Date.now());
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: closePreferenceModal } = useDisclosure();
    const moodValueRef = useRef();
    const danceValueRef = useRef();
    const mixValueRef = useRef();
    const exploreValueRef = useRef();
    const [moodValue, setMoodValue] = useState();
    const [danceValue, setDanceValue] = useState();
    const [mixValue, setMixValue] = useState();
    const [exploreValue, setExploreValue] = useState();

    const handleMouseEnter = () => {
        document.body.style.overflow = 'hidden';
    };

    const handleMouseLeave = () => {
        document.body.style.overflow = 'auto';
    };

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
        color: 'black'
    }

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
            toast.closeAll()
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
            toast.closeAll()
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
            toast.closeAll()
            toast({
                title: 'Song Added',
                description: `Added ${name} to your stitch!`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            toast.closeAll()
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
            toast.closeAll()
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
            toast.closeAll()
            toast({
                description: "Please wait 10 seconds before requesting recommendations again.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            setLoadingRecommended(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/recommendation/${stitchId}`);
            const recommendedSongs = await response.json();
            setRecommendedSongs(recommendedSongs);
            setNextAllowedRequestTime(currentTime + 10000);
        } catch (error) {
            toast.closeAll()
            toast({
                title: "Error",
                description: "Error getting recommendations.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        } finally {
            setLoadingRecommended(false);
        }
    }

    const getStitchPreferences = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/preferences/${stitchId}`);
            const preferences = await response.json();
            moodValueRef.current = preferences.mood;
            danceValueRef.current = preferences.dance;
            mixValueRef.current = preferences.mix;
            exploreValueRef.current = preferences.explore;
            setMoodValue(preferences.mood);
            setDanceValue(preferences.dance);
            setMixValue(preferences.mix);
            setExploreValue(preferences.explore);
        } catch (error) {
            toast.closeAll()
            toast({
                title: "Error",
                description: "Error getting stitch preferences.",
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
            toast.closeAll()
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
        toast.closeAll()
        toast({
            title: 'Stitch Finalized',
            description: `Stitch was saved to your library! Press 'Export to Spotify' on your stitch to update it or add it to Spotify!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
        navigate(`/${username}`);
    };

    const handleToVisualization = async () => {
        await getStitchSongs();
        if (currentStitchSongs.length <= 3) {
            toast.closeAll()
            toast({
                description: "Please have at least 4 songs in your stitch before seeing visualization!",
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        navigate(`/${username}/visualization`, { state: { stitchId } });
    }

    const handlePreferenceModalClose = () => {
        setMoodValue(moodValueRef.current);
        setDanceValue(danceValueRef.current);
        setMixValue(mixValueRef.current);
        setExploreValue(exploreValueRef.current);
        closePreferenceModal();
    };

    const handlePreferenceSubmit = async () => {
        await updatePreferences();
        handlePreferenceModalClose();
    };

    const updatePreferences = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/preferences`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stitchId, mood: moodValue, dance: danceValue, mix: mixValue, explore: exploreValue })
            });

            moodValueRef.current = moodValue;
            danceValueRef.current = danceValue;
            mixValueRef.current = mixValue;
            exploreValueRef.current = exploreValue;

            toast.closeAll()
            toast({
                title: "Success",
                description: "Preferences were saved!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
        } catch (error) {
            toast.closeAll()
            toast({
                title: "Error",
                description: "Error updating stitch preferences",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    };

    useEffect(() => {
        const deleteSong = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/song/${deleteId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error('Failed to delete song');
                }

                toast.closeAll()
                toast({
                    title: 'Song Deleted',
                    description: `Removed song from your stitch!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })

                setDeleteId('');
                getStitchSongs();
            } catch (error) {
                toast.closeAll()
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
            getStitchPreferences();
        }
    }, [deleteId, stitchId, toast]);

    useEffect(() => {
        setRecommendedSongs([]);
    }, [stitchId]);

    return (
        <Box className='Create'>
            <Box flex='1'>
                <header>
                    <Box bgGradient="radial-gradient(circle, rgba(115, 41, 123, 1) 0%, rgba(0,0,0,1) 86%)">
                        <Navbar username={username} page={action} stitchId={stitchId} />
                    </Box>
                </header>
                <main>
                    <PreferenceModal
                        isOpen={isCreateOpen}
                        onClose={handlePreferenceModalClose}
                        moodValue={moodValue}
                        setMoodValue={setMoodValue}
                        danceValue={danceValue}
                        setDanceValue={setDanceValue}
                        mixValue={mixValue}
                        setMixValue={setMixValue}
                        exploreValue={exploreValue}
                        setExploreValue={setExploreValue}
                        handlePreferenceSubmit={handlePreferenceSubmit}
                        labelStyles={labelStyles}
                    />

                    <Box width="100%" display="flex" justifyContent="space-evenly" my='1em' height='90vh'>
                        <Box className="stitchSection" color="white" flex="1">
                            <Box px='2em' width='53em'>
                                <CustomName stitchId={stitchId} />
                            </Box>
                            <Flex direction="row" justifyContent="left" mt="1em" gap="0.5em" pl="2em">
                                <Button
                                    bg="rgb(225, 225, 225)"
                                    color="black"
                                    size="sm"
                                    _focus={{ boxShadow: 'none' }}
                                    _active={{ boxShadow: 'none' }}
                                    _hover={{
                                        boxShadow: '0 0 20px -2px rgba(255, 255, 255, 0.9)',
                                        transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                                    }}
                                    onClick={onCreateOpen}
                                >
                                    Preferences
                                </Button>
                                <Button
                                    bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                                    color="white"
                                    size="sm"
                                    _focus={{ boxShadow: 'none' }}
                                    _active={{ boxShadow: 'none' }}
                                    _hover={{
                                        opacity: 1,
                                        backgroundSize: 'auto',
                                        boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                                        transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                                    }}
                                    onClick={handleToVisualization}
                                >
                                    View Visualization
                                </Button>
                                <Button
                                    bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                                    color="white"
                                    size="sm"
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
                                    Finalize Stitch
                                </Button>
                            </Flex>
                            <Box mt="1em" px="2em" overflowY="auto" maxH="67vh" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                {currentStitchSongs.map((song, index) => (
                                    <Flex justifyContent="center" key={index}>
                                        <Song
                                            key={song.id}
                                            track={song}
                                            onPlay={handleAudioPlay}
                                            location="currentStitch"
                                            onRemove={() => handleRemove(song.id)}
                                        />
                                    </Flex>
                                ))}
                            </Box>
                        </Box>
                        <Center>
                            <Divider orientation='vertical' />
                        </Center>
                        <Box className="searchSection" color="white" minHeight="100vh" flex="1">
                            <Flex direction="row" justifyContent="space-between" alignItems="center" gap="1em" px="2em">
                                <Box textAlign="center" mb='1em' flex='1'>
                                    <FormControl mt="1em">
                                        <Input
                                            type='text'
                                            onChange={handleSearch}
                                            placeholder='Search for songs here...'
                                            focusBorderColor='rgb(83, 41, 140)'
                                        />
                                    </FormControl>
                                </Box>
                                <Button
                                    bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                                    color="white"
                                    size="sm"
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
                                    Get Recommendations
                                </Button>
                            </Flex>
                            <Box px='2em'>
                                {searchOptions.slice(0, 3).map((track, index) => (
                                    <Flex justifyContent="center" key={index}>
                                        <Song
                                            track={track}
                                            onPlay={handleAudioPlay}
                                            location="addSongs"
                                            onAdd={() => handleAddSong(track)}
                                        />
                                    </Flex>
                                ))}
                            </Box>

                            <Box px='2em' mt='1em'>
                                {loadingRecommended ? (
                                    <>
                                        <Text mb='1em' fontWeight='bold'>Recommended Songs</Text>
                                        <Center>
                                            <Spinner size='xl' color='rgb(83, 41, 140)' emptyColor='gray.200' />
                                        </Center>
                                    </>
                                ) : (
                                    <>
                                        {recommendedSongs.length > 0 && (
                                            <>
                                                <Text mb='1em' fontWeight='bold'>Recommended Songs</Text>
                                                {recommendedSongs.slice(0, 5).map((track) => (
                                                    <Flex justifyContent="center" key={track.id}>
                                                        <Song
                                                            track={track}
                                                            onPlay={handleAudioPlay}
                                                            location="addSongs"
                                                            onAdd={() => handleAddSong(track)}
                                                        />
                                                    </Flex>
                                                ))}
                                            </>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </main>
            </Box>
            <footer>
                <Footer />
            </footer>
        </Box>
    )
}

export default Create;
