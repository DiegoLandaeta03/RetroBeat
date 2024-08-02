import {
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const CustomName = ({ stitchId }) => {
    const [title, setTitle] = useState('Untitled');
    const toast = useToast();

    const handleSubmit = async () => {
        let newTitle = title;
        if (!title) {
            setTitle('Untitled');
            newTitle = 'Untitled';
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/title`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stitchId, title: newTitle }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stitch name');
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
    }, [stitchId, toast]);

    return (
        <Flex align='left' width='auto'>
            <Editable
                textAlign='left'
                fontSize='6xl'
                // fontWeight='bold'
                color='white'
                value={title}
                onChange={(nextValue) => setTitle(nextValue)}
                isPreviewFocusable={true}
                onSubmit={handleSubmit}
                submitOnBlur={true}
                width='100%'
            >
                <EditablePreview
                    _hover={{
                        cursor: 'pointer'
                    }}
                    whiteSpace="normal"
                    overflow="visible"
                    textOverflow="clip"
                    width="100%"
                />
                <EditableInput
                    fontSize='6xl'
                    _focus={{
                        boxShadow: '0 0 0 3px rgb(83, 41, 140)',
                    }}
                />
            </Editable>
        </Flex >
    );
};

export default CustomName;