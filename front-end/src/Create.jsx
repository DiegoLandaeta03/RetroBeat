import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Box, Input, FormControl, FormLabel, Heading } from '@chakra-ui/react'
import Navbar from './Navbar'
import Song from './Song';

function Create() {
    const params = useParams();
    const username = params.username;
    const [searchOptions, setSearchOptions] = useState([]);

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
            const access_token = localStorage.getItem('access_token');
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(song)}&type=track`, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const searchData = await response.json();
            setSearchOptions(searchData.tracks.items);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='Create'>
            <header>
                <Navbar username={username} />
            </header>
            <main>
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

                        <Box width="1em" bg="rgb(83, 41, 140)">

                        </Box>
                        <Box width='30em'>
                            {searchOptions.slice(0, 3).map((track) => (
                                <Song key={track.id} track={track} />
                            ))}
                        </Box>
                    </Box>
                    <Box className="searchSection" color="white" minHeight="100vh" display="flex" flexDirection="column" alignItems="center" flex="1" mt="2em">
                        <Heading as='h3' size='xl'>Current Stitch</Heading>
                    </Box>
                </Box>
            </main>
        </div>
    )
}

export default Create
