import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import noImage from './assets/Image_not_available.png';
import PreferenceModal from './PreferenceModal';
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
    SimpleGrid,
    Image,
    useToast
} from "@chakra-ui/react";
import { HamburgerIcon, LockIcon, SunIcon, AddIcon } from '@chakra-ui/icons';

function Navbar({ username, page, stitchId }) {
    const navigate = useNavigate();
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: closePreferenceModal } = useDisclosure();
    const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure();
    const { isOpen: isWarningOpen, onOpen: onWarningOpen, onClose: closeWarningModal } = useDisclosure();
    const [moodValue, setMoodValue] = useState(50);
    const [danceValue, setDanceValue] = useState(50);
    const [mixValue, setMixValue] = useState(50);
    const [exploreValue, setExploreValue] = useState(50);
    const [profileData, setProfileData] = useState(null);
    const [userTopTracks, setUserTopTracks] = useState(null);
    const leavePage = useRef(false);
    const [selectedPage, setSelectedPage] = useState('');
    const toast = useToast();

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
        color: 'black'
    }

    const fetchProfileData = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            toast({
                title: "Error",
                description: "No access token: please logout and log back in!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            navigate('/');
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

    const fetchTopUserTracks = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            toast({
                title: "Error",
                description: "No access token: please logout and log back in!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            navigate('/');
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch your top tracks');
            }
            const data = await response.json();
            setUserTopTracks(data.items);
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

    const handleLeavePage = async () => {
        leavePage.current = true;
        await deleteStitch();

        closeWarningModal();

        if (selectedPage == 'home') {
            handleNavigateToHome();
        }

        if (selectedPage == 'create') {
            handlePreferenceSubmit();
        }

        if (selectedPage == 'logout') {
            handleLogout();
        }

        leavePage.current = false;
    };

    const deleteStitch = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/${stitchId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error('Failed to delete stitch');
            }
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

    const handleNavigateToHome = () => {
        if (page == 'create' && !leavePage.current) {
            onWarningOpen();
            setSelectedPage('home');
            return;
        }
        navigate(`/${username}`);
    };

    const handleOpenPreferenceModal = () => {
        onCreateOpen();
    };

    const handlePreferenceModalClose = () => {
        setMoodValue(50);
        setDanceValue(50);
        setMixValue(50);
        setExploreValue(50);
        closePreferenceModal();
    };

    const handlePreferenceSubmit = async () => {
        if (page == 'create' && !leavePage.current) {
            onWarningOpen();
            setSelectedPage('create');
            closePreferenceModal();
            return;
        }

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
                    mood: values.moodValue,
                    dance: values.danceValue,
                    mix: values.mixValue,
                    explore: values.exploreValue,
                    imageUrl: noImage
                })
            });
            const data = await response.json();
            return data.id;
        } catch (error) {
            toast({
                title: "Error",
                description: `Error creating new stitch: ${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    };

    const handleLogout = () => {
        if (page == 'create' && !leavePage.current) {
            onWarningOpen();
            setSelectedPage('logout');
            return;
        }

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

                <Modal isOpen={isWarningOpen} onClose={closeWarningModal} motionPreset='scale' isCentered>
                    <ModalOverlay />
                    <ModalContent display='flex' flexDirection='column' justifyContent='center' textAlign='center'>
                        <ModalHeader color='black'>Are you sure you want to continue?</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text color='black'>If you exit this page, all progress on the current stitch will be lost.</Text>
                        </ModalBody>

                        <ModalFooter display="flex" justifyContent="center">
                            <Button mr={3} onClick={closeWarningModal}>Close</Button>
                            <Button colorScheme='red' onClick={handleLeavePage}>Continue</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

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
                            onClick={handleOpenPreferenceModal}
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
