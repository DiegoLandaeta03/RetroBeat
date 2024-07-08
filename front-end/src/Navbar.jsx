import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Flex,
    Spacer,
    Heading,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";

import { LockIcon, SunIcon, AddIcon } from '@chakra-ui/icons';

function Navbar({ username }) {
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleHome = () => {
        navigate(`/${username}`);
    };

    const handleCreate = () => {
        navigate(`/${username}/create`);
    };

    const handleLogout = () => {
        try {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/logout`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('access_token')
                })
            });

            localStorage.removeItem('access_token');
            navigate('/');
        } catch (error) {
            alert('Failed to logout');
        }
    };

    return (
        <Box w="70%" color="white" p={4} mx="auto">
            <Flex align="center">
                <Button
                    className="profileIcon"
                    bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                    borderRadius="full"
                    color="white"
                    px={6}
                    py={3}
                    _hover={{
                        opacity: 1,
                        backgroundSize: 'auto',
                        boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                        transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                    }}
                >
                    <Text fontSize="lg">Profile</Text>
                </Button>

                <Spacer />

                <Heading as='h1' size='2xl' textAlign='center' flexGrow={1}>
                    SoundStitch
                </Heading>

                <Spacer />

                <Menu>
                    <MenuButton
                        as={Button}
                        aria-label='Options'
                        bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                        color={'white'}
                        _hover={{
                            opacity: 1,
                            backgroundSize: 'auto',
                            boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                            transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                        }}>
                        <Text fontSize="lg">Menu</Text>
                    </MenuButton>

                    <MenuList style={{ padding: 0, margin: 0 }} bgColor="#242424">
                        <MenuItem
                            style={{ margin: 0 }}
                            icon={<SunIcon />}
                            onClick={handleHome}
                            color={'black'}
                            _hover={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                            _focus={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                        >
                            <Text fontSize="lg">Home</Text>
                        </MenuItem>
                        <MenuItem
                            style={{ margin: 0 }}
                            icon={<AddIcon />}
                            onClick={handleCreate}
                            color={'black'}
                            _hover={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                            _focus={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                        >
                            <Text fontSize="lg">Create Playlist</Text>
                        </MenuItem>
                        <MenuItem
                            style={{ margin: 0 }}
                            icon={<LockIcon />}
                            onClick={handleLogout}
                            color={'black'}
                            _hover={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                            _focus={{
                                bg: 'linear-gradient(0deg, rgba(115, 41, 123, 0.9) 10%, rgba(83, 41, 140, 0.9) 100%)',
                                color: 'white',
                            }}
                        >
                            <Text fontSize="lg">Logout</Text>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Box>
    );
}

export default Navbar;
