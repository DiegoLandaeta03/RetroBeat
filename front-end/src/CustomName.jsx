import {
    Editable,
    EditableInput,
    EditablePreview,
    useEditableControls,
    ButtonGroup,
    IconButton,
    Flex,
    Input,
    Box,
    useToast
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';

const CustomName = ({ stitchId }) => {
    const [title, setTitle] = useState('Untitled');
    const [revTitle, setRevTitle] = useState('Untitled');
    const toast = useToast();

    const handleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleSubmit = async () => {
        if (!title) {
            setTitle('Untitled');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/title`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stitchId, title }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stitch name');
            }

            setRevTitle(title);
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

    const handleAbort = () => {
        setTitle(revTitle);
    };

    useEffect(() => {
        const fetchStitchName = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/title/${stitchId}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch stitch name');
                }

                const data = await response.json();
                setTitle(data.title || 'Untitled');
                setRevTitle(data.title || 'Untitled');
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Error fetching stitch name: ${error.message}`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            }
        };

        fetchStitchName();
    }, [stitchId]);

    const EditableControls = () => {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls();

        return isEditing ? (
            <ButtonGroup justifyContent='center' size='sm'>
                <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
                <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent='center'>
                <IconButton size='sm' onClick={() => setRevTitle(title)} icon={<EditIcon />} {...getEditButtonProps()} />
            </Flex>
        );
    };

    return (
        <Box width="40em">
            <Editable
                textAlign='center'
                fontSize='4xl'
                fontWeight='bold'
                color='white'
                value={title}
                isPreviewFocusable={false}
                onSubmit={handleSubmit}
                onCancel={handleAbort}
            >
                <EditablePreview />
                <Input as={EditableInput} focusBorderColor='rgb(83, 41, 140)' fontSize='3xl' onChange={handleChange}/>
                <EditableControls />
            </Editable>
        </Box>
    );
};

export default CustomName;
