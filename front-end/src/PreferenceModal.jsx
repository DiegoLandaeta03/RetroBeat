import { useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    Heading,
    Text,
    Slider,
    SliderMark,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip
} from "@chakra-ui/react";

const PreferenceModal = ({
    isOpen,
    onClose,
    moodValue,
    setMoodValue,
    danceValue,
    setDanceValue,
    mixValue,
    setMixValue,
    exploreValue,
    setExploreValue,
    handlePreferenceSubmit,
    labelStyles
}) => {
    const [showMoodValue, setShowMood] = useState(false);
    const [showDanceValue, setShowDance] = useState(false);
    const [showMixValue, setShowMix] = useState(false);
    const [showExploreValue, setShowExplore] = useState(false);

    return (
        <Modal size="xl" onClose={onClose} isOpen={isOpen} motionPreset='slideInBottom' isCentered>
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
                            value={moodValue}
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
                            value={danceValue}
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
                            value={mixValue}
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
                            value={exploreValue}
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
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PreferenceModal;