import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SpotifyCallback() {
    const location = useLocation();
    const navigate = useNavigate();
    const tokenFetched = useRef(false);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code && !tokenFetched.current) {
            exchangeCodeForToken(code);
            tokenFetched.current = true;
        }
    }, [location]);

    const exchangeCodeForToken = async (code) => {
        try {
            const response = await fetch(`http://localhost:3000/auth/exchange_code`, {
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
            localStorage.setItem('access_token', data.access_token)
            createUser();
        } catch (error) {
            console.error('Error:', error);
            navigate('/');
        }
    };

    function createUser() {
        const accessToken = localStorage.getItem('access_token');
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
                    const token = localStorage.getItem('access_token')
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
                });
        } else {
            console.error('No access token found');
        }
    }

    return (
        <div>Loading...</div>
    );
}

export default SpotifyCallback;