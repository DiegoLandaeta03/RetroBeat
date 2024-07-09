import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Box, Input, FormControl, FormLabel, Text } from '@chakra-ui/react'
import './Create.css'
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
            <Box className="searchSection" color="white" minHeight="100vh" display="flex" flexDirection="column" alignItems="center">
                    <Box textAlign="center" mb={4}>
                        <FormControl>
                            <FormLabel textAlign="center" w="100%">Search for songs</FormLabel>
                            <Input 
                                type='text'  
                                onChange={handleSearch} 
                                placeholder='Welcome to the Jungle' 
                                focusBorderColor='rgb(83, 41, 140)' 
                            />
                        </FormControl>
                    </Box>
                    <Box width='30em'>
                        {searchOptions.slice(0, 5).map((track) => (
                            <Song key={track.id} track={track} />
                        ))}
                    </Box>
                </Box>
            </main>
        </div>
    )
}

export default Create
