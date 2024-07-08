import { Box, Button, Heading } from "@chakra-ui/react";
import React from "react";

function SpotifyLogin() {
    return (
        <Box className="SpotifyLogin" color="white" minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
            <Box textAlign="center">
                <Heading as="h1" size="2xl" mb={8}>
                    Welcome to SoundStitch
                </Heading>
                <Button className="btn_spotify"
                    bg="linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgb(81, 40, 138, 0.9) 100%)"
                    size="lg"
                    as="a"
                    href={`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/login`}
                    color={"white"}
                    transition="background 0.3s ease-in-out"
                    _hover={{ color: "black", 
                    bg: "white",
                    transition: "background 0.3s ease-in-out",
                    boxShadow: "0 0 20px -2px rgba(195, 111, 199, .5)" }}>
                    Log in with Spotify
                </Button>
            </Box>
        </Box>
    );
}

export default SpotifyLogin;
