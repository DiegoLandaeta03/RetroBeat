import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
    SliderThumb
} from "@chakra-ui/react";
import { HamburgerIcon, LockIcon, SunIcon, AddIcon } from '@chakra-ui/icons';

function Navbar({ username, page }) {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
    const [moodValue, setMoodValue] = useState(50);
    const [danceValue, setDanceValue] = useState(50);
    const [mixValue, setMixValue] = useState(50);
    const [exploreValue, setExploreValue] = useState(50);
    const [showMoodValue, setShowMood] = useState(false);
    const [showDanceValue, setShowDance] = useState(false);
    const [showMixValue, setShowMix] = useState(false);
    const [showExploreValue, setShowExplore] = useState(false);

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
        color: 'black'
    }


    const handleNavigateToHome = () => {
        navigate(`/${username}`);
    };

    const handleModalClose = () => {
        setMoodValue(50);
        setDanceValue(50);
        setMixValue(50);
        setExploreValue(50);
        closeModal();
    };

    const handlePreferenceSubmit = async () => {
        const stitchId = await createStitch({ moodValue, danceValue, mixValue, exploreValue });
        handleModalClose();
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

    return (
        <Box w="100%" color="white" p={4} mx="auto" paddingTop='2em' paddingBottom='2em' bgGradient="radial-gradient(circle, rgba(115, 41, 123, 1) 0%, rgba(0,0,0,1) 86%)" paddingLeft='0'>
            <Flex align="center">
                <Heading marginLeft='0.7em' paddingLeft='0' as='h1' size='2xl' textAlign='left' flexGrow={1}>
                    SoundStitch
                </Heading>

                <Button
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
                            onClick={onOpen}
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

                        <Modal size="xl" onClose={handleModalClose} isOpen={isOpen} motionPreset='slideInBottom' isCentered>
                            <ModalOverlay backdropFilter='auto' backdropBlur='2px' />
                            <ModalContent>
                                <ModalHeader color="black" textAlign="center">
                                    Stitch Preferences
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody textAlign="center">
                                    <Text color='black' as='b'>Mood</Text>
                                    <Box p={4} pt={7} mb='2em'>
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
                                    </Box>
                                    <Text color='black' as='b'>Danceability</Text>
                                    <Box p={4} pt={7} mb='2em'>
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
                                    </Box>
                                    <Text color='black' as='b'>Mixability</Text>
                                    <Box p={4} pt={7} mb='2em'>
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
                                    </Box>
                                    <Text color='black' as='b'>Explore</Text>
                                    <Box p={4} pt={7}>
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
                                    </Box>
                                </ModalBody>
                                <ModalFooter display="flex" justifyContent="center">
                                    <Button onClick={handlePreferenceSubmit}>Submit</Button>
                                    <Button onClick={handleModalClose} ml={3}>Close</Button>
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
