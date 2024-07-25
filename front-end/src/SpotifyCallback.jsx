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

    async function createUser() {
        setIsLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const userResponse = await fetch('https://api.spotify.com/v1/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
    
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
    
                const userData = await userResponse.json();
                const { email, id: username } = userData;
                const token = accessToken;
    
                const loginResponse = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, username, token }),
                });
    
                if (!loginResponse.ok) {
                    throw new Error('Failed to log in');
                }
    
                navigate(`/${username}`);
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 3000);
            }
        } else {
            toast({
                title: "Error",
                description: "No access token found",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            navigate('/');
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