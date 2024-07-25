import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import noImage from './assets/Image_not_available.png';
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Slider,
    SliderMark,
    SliderTrack,
    SliderFilledTrack,
    Tooltip,
    SliderThumb,
    SimpleGrid,
    Image
} from "@chakra-ui/react";
import { HamburgerIcon, LockIcon, SunIcon, AddIcon } from '@chakra-ui/icons';

function Navbar({ username, page }) {
    const navigate = useNavigate();
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: closePreferenceModal } = useDisclosure();
    const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
    const [moodValue, setMoodValue] = useState(50);
    const [danceValue, setDanceValue] = useState(50);
    const [mixValue, setMixValue] = useState(50);
    const [exploreValue, setExploreValue] = useState(50);
    const [showMoodValue, setShowMood] = useState(false);
    const [showDanceValue, setShowDance] = useState(false);
    const [showMixValue, setShowMix] = useState(false);
    const [showExploreValue, setShowExplore] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [userTopTracks, setUserTopTracks] = useState(null);

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
        color: 'black'
    }

    const fetchProfileData = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('Access token not available.');
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const fetchTopUserTracks = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('Access token not available.');
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/top/tracks`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            setUserTopTracks(data.items);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    const handleNavigateToHome = () => {
        navigate(`/${username}`);
    };

    const handlePreferenceModalClose = () => {
        setMoodValue(50);
        setDanceValue(50);
        setMixValue(50);
        setExploreValue(50);
        closePreferenceModal();
    };

    const handlePreferenceSubmit = async () => {
        const stitchId = await createStitch({ moodValue, danceValue, mixValue, exploreValue });
        handlePreferenceModalClose();
        navigate(`/${username}/create`, { state: { stitchId } });
    };

    const createStitch = async (values) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Untitled',
                    username,
                    mood: values.moodValue / 100,
                    dance: values.danceValue / 100,
                    mix: values.mixValue / 100,
                    explore: values.exploreValue / 100,
                    imageUrl: noImage
                })
            });
            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error('Error creating new stitch:', error);
        }
    };


    const handleLogout = () => {
        try {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/logout`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('accessToken')
                })
            });

            localStorage.removeItem('accessToken');
            navigate('/');
        } catch (error) {
            alert('Failed to logout');
        }
    };

    useEffect(() => {
        fetchProfileData();
        fetchTopUserTracks();
    }, []);

    return (
        <Box w="100%" color="white" p={4} mx="auto" paddingTop='2em' paddingBottom='2em' paddingLeft='0'>
            <Flex align="center">
                <Heading marginLeft='0.7em' paddingLeft='0' as='h1' size='2xl' textAlign='left' flexGrow={1}>
                    SoundStitch
                </Heading>

                <Button
                    onClick={onProfileOpen}
                    className="profileIcon"
                    bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                    color="white"
                    px={6}
                    py={3}
                    marginRight='1em'
                    _active={{ boxShadow: 'none', bg: 'white', color: 'black' }}
                    _hover={{
                        opacity: 1,
                        backgroundSize: 'auto',
                        boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                        transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                    }}
                >
                    <Text fontSize="lg">{username}</Text>
                </Button>

                <Modal isOpen={isProfileOpen} onClose={onProfileClose} size='lg' motionPreset='slideInTop' isCentered>
                    <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
                    <ModalContent>
                        <ModalHeader color='black' textAlign='center'>
                            <Heading as='h2' size='xl'>About You</Heading>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {profileData && userTopTracks ? (
                                <Box>
                                    <Box display='flex' justifyContent='space-evenly'>
                                        <Box flex='1' textAlign='center'>
                                            <Text color='black'>
                                                <span style={{ fontWeight: 'bold' }}>Username:</span> {profileData.display_name}
                                            </Text>
                                        </Box>
                                        <Box flex='1' textAlign='center'>
                                            <Text color='black'>
                                                <span style={{ fontWeight: 'bold' }}>Total Followers:</span> {profileData.followers.total}
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Box textAlign='center' mt='1em'>
                                        <Text color='black' fontWeight='bold'>Top Songs</Text>
                                    </Box>
                                    <Box display='flex' justifyContent='space-evenly'>
                                        <SimpleGrid columns={2} spacing={4} p={2}>
                                            {userTopTracks.slice(0, 4).map((song) => (
                                                <Box key={song.id} textAlign='center' width='12em'>
                                                    <Image src={song.album.images[0].url} alt='Song Image' boxSize='12em' objectFit='cover' />
                                                    <Text color='black' fontWeight='bold' isTruncated>{song.name}</Text>
                                                    <Text color='black' isTruncated>by {song.artists[0].name}</Text>
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                </Box>
                            ) : (
                                <Text color='black'>Loading profile data...</Text>
                            )}
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<HamburgerIcon />}
                        bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                        color={'white'}
                        _focus={{ boxShadow: 'none' }}
                        _active={{ boxShadow: 'none', bg: 'white', color: 'black' }}
                        _hover={{
                            opacity: 1,
                            backgroundSize: 'auto',
                            boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                            transform: 'translate3d(0, -0.5px, 0) scale(1.01)',

                        }}>
                    </MenuButton>

                    <MenuList style={{ padding: 0, margin: 0, border: 'none' }} bgColor="#242424">
                        <MenuItem
                            style={{ margin: 0 }}
                            icon={<SunIcon />}
                            onClick={handleNavigateToHome}
                            color={'black'}
                            _hover={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                            _focus={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                        >
                            <Text fontSize="lg">Home</Text>
                        </MenuItem>
                        <MenuItem
                            style={{ margin: 0 }}
                            icon={<AddIcon />}
                            onClick={onCreateOpen}
                            color={'black'}
                            _hover={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                            _focus={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                        >
                            <Text fontSize="lg">Create Stitch</Text>
                        </MenuItem>

                        <Modal size="xl" onClose={handlePreferenceModalClose} isOpen={isCreateOpen} motionPreset='slideInBottom' isCentered>
                            <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
                            <ModalContent>
                                <ModalHeader textAlign="center">
                                    <Heading color='black'>Stitch Preferences</Heading>
                                    <Text color='gray.700' fontSize='sm' mt='1.5em'>Answer the following questions so we can give you personalized recommendations!</Text>
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody textAlign="center">
                                    <Text color='black' as='b'>Mood</Text>
                                    <Box p={2} pt={7} mb='1em'>
                                        <Slider aria-label='slider-ex-6'
                                            onChange={(val) => setMoodValue(val)}
                                            onMouseEnter={() => setShowMood(true)}
                                            onMouseLeave={() => setShowMood(false)}>
                                            <SliderMark value={25} {...labelStyles}>
                                                25%
                                            </SliderMark>
                                            <SliderMark value={50} {...labelStyles}>
                                                50%
                                            </SliderMark>
                                            <SliderMark value={75} {...labelStyles}>
                                                75%
                                            </SliderMark>
                                            <SliderTrack>
                                                <SliderFilledTrack sx={{ bgColor: 'rgb(83, 41, 140)' }} />
                                            </SliderTrack>
                                            <Tooltip
                                                hasArrow
                                                bg='rgb(83, 41, 140)'
                                                color='white'
                                                placement='top'
                                                isOpen={showMoodValue}
                                                label={`${moodValue}%`}
                                            >
                                                <SliderThumb />
                                            </Tooltip>
                                        </Slider>
                                        <Text color='gray.700' fontSize='sm' mt='1.5em'>How important is consistent mood in your stitch? 100% = consistent 🙂.</Text>
                                    </Box>
                                    <Text color='black' as='b'>Danceability</Text>
                                    <Box p={2} pt={7} mb='1em'>
                                        <Slider aria-label='slider-ex-6'
                                            onChange={(val) => setDanceValue(val)}
                                            onMouseEnter={() => setShowDance(true)}
                                            onMouseLeave={() => setShowDance(false)}>
                                            <SliderMark value={25} {...labelStyles}>
                                                25%
                                            </SliderMark>
                                            <SliderMark value={50} {...labelStyles}>
                                                50%
                                            </SliderMark>
                                            <SliderMark value={75} {...labelStyles}>
                                                75%
                                            </SliderMark>
                                            <SliderTrack>
                                                <SliderFilledTrack sx={{ bgColor: 'rgb(83, 41, 140)' }} />
                                            </SliderTrack>
                                            <Tooltip
                                                hasArrow
                                                bg='rgb(83, 41, 140)'
                                                color='white'
                                                placement='top'
                                                isOpen={showDanceValue}
                                                label={`${danceValue}%`}
                                            >
                                                <SliderThumb />
                                            </Tooltip>
                                        </Slider>
                                        <Text color='gray.700' fontSize='sm' mt='1.5em'>How important is dancing in your stitch? 100% = dance party 🕺.</Text>
                                    </Box>
                                    <Text color='black' as='b'>Mixability</Text>
                                    <Box p={2} pt={7} mb='1em'>
                                        <Slider aria-label='slider-ex-6'
                                            onChange={(val) => setMixValue(val)}
                                            onMouseEnter={() => setShowMix(true)}
                                            onMouseLeave={() => setShowMix(false)}>
                                            <SliderMark value={25} {...labelStyles}>
                                                25%
                                            </SliderMark>
                                            <SliderMark value={50} {...labelStyles}>
                                                50%
                                            </SliderMark>
                                            <SliderMark value={75} {...labelStyles}>
                                                75%
                                            </SliderMark>
                                            <SliderTrack>
                                                <SliderFilledTrack sx={{ bgColor: 'rgb(83, 41, 140)' }} />
                                            </SliderTrack>
                                            <Tooltip
                                                hasArrow
                                                bg='rgb(83, 41, 140)'
                                                color='white'
                                                placement='top'
                                                isOpen={showMixValue}
                                                label={`${mixValue}%`}
                                            >
                                                <SliderThumb />
                                            </Tooltip>
                                        </Slider>
                                        <Text color='gray.700' fontSize='sm' mt='1.5em'>How important is the mixability of your stitch? 100% = DJ level 🎧.</Text>
                                    </Box>
                                    <Text color='black' as='b'>Explore</Text>
                                    <Box p={2} pt={7}>
                                        <Slider aria-label='slider-ex-6'
                                            onChange={(val) => setExploreValue(val)}
                                            onMouseEnter={() => setShowExplore(true)}
                                            onMouseLeave={() => setShowExplore(false)}>
                                            <SliderMark value={25} {...labelStyles}>
                                                25%
                                            </SliderMark>
                                            <SliderMark value={50} {...labelStyles}>
                                                50%
                                            </SliderMark>
                                            <SliderMark value={75} {...labelStyles}>
                                                75%
                                            </SliderMark>
                                            <SliderTrack>
                                                <SliderFilledTrack sx={{ bgColor: 'rgb(83, 41, 140)' }} />
                                            </SliderTrack>
                                            <Tooltip
                                                hasArrow
                                                bg='rgb(83, 41, 140)'
                                                color='white'
                                                placement='top'
                                                isOpen={showExploreValue}
                                                label={`${exploreValue}%`}
                                            >
                                                <SliderThumb />
                                            </Tooltip>
                                        </Slider>
                                        <Text color='gray.700' fontSize='sm' mt='1.5em'>How important is finding music you haven't listened to? 100% = explorer 🧭.</Text>
                                    </Box>
                                </ModalBody>
                                <ModalFooter display="flex" justifyContent="center">
                                    <Button onClick={handlePreferenceSubmit}>Submit</Button>
                                    <Button onClick={handlePreferenceModalClose} ml={3}>Close</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>

                        <MenuItem
                            style={{ margin: 0 }}
                            icon={<LockIcon />}
                            onClick={handleLogout}
                            color={'black'}
                            _hover={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                            _focus={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                        >
                            <Text fontSize="lg">Logout</Text>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Box>
    );
}

export default Navbar;
