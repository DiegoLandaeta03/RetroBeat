import Navbar from './Navbar';
import './Home.css';
import { Heading, Box, SimpleGrid, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Stitch from './Stitch';
import Footer from './Footer';

function Home() {
    const params = useParams();
    const username = params.username;
    const [stitches, setStitches] = useState([]);
    const [deleteId, setDeleteId] = useState();
    const toast = useToast();

    const getStitches = async () => {
        try {
            const options = {
                method: "GET",
            };
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/${username}`, options);
            const data = await response.json();
            setStitches(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Error loading your stitches.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }
    };

    const deleteStitch = (stitchId) => (event) => {
        event.stopPropagation();
        setDeleteId(stitchId);
    };

    useEffect(() => {
        const deleteStitch = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/${deleteId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error('Failed to delete stitch');
                }

                setDeleteId('');
                getStitches();
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
            deleteStitch();
        } else {
            getStitches();
        }
    }, [deleteId, username, toast]);

    return (
        <Box className='Home' display='flex' flexDirection='column' minHeight='100vh'>
            <header>
                <Box bgGradient="radial-gradient(circle, rgba(115, 41, 123, 1) 0%, rgba(0,0,0,1) 86%)">
                    <Navbar username={username} page={"home"} />
                </Box>
            </header>
            <main>
                <Box className='beatTitle'>
                    <Heading as='h2' size='2xl'>Your Stitches</Heading>
                </Box>
                {stitches && (
                    <SimpleGrid spacing={6} p={7} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                        {stitches.map((stitch) => (
                            <Stitch key={stitch.id} stitch={stitch} username={username} deleteStitch={deleteStitch} />
                        ))}
                    </SimpleGrid>
                )}
            </main>
            <footer>
                <Footer />
            </footer>
        </Box>
    );
}

export default Home;
