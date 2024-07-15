import Navbar from './Navbar';
import './Home.css';
import { Heading, Box, SimpleGrid } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Stitch from './Stitch';

function Home() {
    const params = useParams();
    const username = params.username;
    const [stitches, setStitches] = useState([]);
    const [deleteId, setDeleteId] = useState();

    const getStitches = async () => {
        try {
            const options = {
                method: "GET",
            };
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/${username}`, options);
            const data = await response.json();
            setStitches(data);
        } catch (error) {
            console.error('Error getting stitches:', error);
        }
    };

    const deleteStitch = (stitchId) => (event) => {
        event.stopPropagation();
        setDeleteId(stitchId);
    };

    useEffect(() => {
        if (deleteId) {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/stitch/${deleteId}`, {
                method: "DELETE",
            })
                .then(response => {
                    if (response.ok) {
                        setDeleteId('');
                        getStitches();
                    } else {
                        throw new Error('Failed to delete stitch');
                    }
                })
                .catch(error => console.error('Error deleting stitch:', error));
        } else {
            getStitches();
        }
    }, [deleteId, username]);

    return (
        <div className='Home'>
            <header>
                <Navbar username={username} page={"home"} />
            </header>
            <main>
                <Box className='beatTitle'>
                    <Heading as='h2' size='2xl'>Your Stitches</Heading>
                </Box>
                {stitches && (
                    <SimpleGrid spacing={4} p={10} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                        {stitches.map((stitch) => (
                            <Stitch key={stitch.id} stitch={stitch} username={username} deleteStitch={deleteStitch}/>
                        ))}
                    </SimpleGrid>
                )}
            </main>
        </div>
    );
}

export default Home;
