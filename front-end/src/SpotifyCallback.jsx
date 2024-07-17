import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner, Box, Text } from '@chakra-ui/react';

function SpotifyCallback() {
    const location = useLocation();
    const navigate = useNavigate();
    const tokenFetched = useRef(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code && !tokenFetched.current) {
            exchangeCodeForToken(code);
            tokenFetched.current = true;
        }
    }, [location]);

    const exchangeCodeForToken = async (code) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/exchange_code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            if (!response.ok) {
                throw new Error('Failed to exchange code for token');
            }
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken)
            createUser();
        } catch (error) {
            console.error('Error:', error);
            navigate('/');
        }
    };

    function createUser() {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
                .then(response => response.json())
                .then(result => {
                    const email = result.email
                    const username = result.id
                    const token = localStorage.getItem('accessToken')
                    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email,
                                username,
                                token
                            }),
                        })
                    navigate(`/${username}`);
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 3000);
                });
        } else {
            console.error('No access token found');
        }
    }

    return (
        <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Text mb={4} fontSize="3xl" color="white">
                Logging you in...
            </Text>
            {isLoading && (
                <Spinner
                    thickness="6px"
                    speed="0.5s"
                    size="xl"
                    color="purple"
                />
            )}
        </Box>
    );
}

export default SpotifyCallback;