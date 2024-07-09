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
    IconButton
} from "@chakra-ui/react";

import { HamburgerIcon, LockIcon, SunIcon, AddIcon } from '@chakra-ui/icons';

function Navbar({ username }) {
    const navigate = useNavigate();

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
        <Box w="100%"  color="white" p={4} mx="auto" paddingTop='2em' paddingBottom='2em' bgGradient="radial-gradient(circle, rgba(115, 41, 123, 1) 0%, rgba(0,0,0,1) 86%)" paddingLeft='0'>
            <Flex align="center">
                <Heading marginLeft='0.7em' paddingLeft='0' as='h1' size='2xl' textAlign='left' flexGrow={1}>
                    SoundStitch
                </Heading>

                <Button
                    className="profileIcon"
                    bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                    color="white"
                    px={6}
                    py={3}
                    marginRight='1em'
                    _hover={{
                        opacity: 1,
                        backgroundSize: 'auto',
                        boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                        transform: 'translate3d(0, -0.5px, 0) scale(1.01)',
                    }}
                >
                    <Text fontSize="lg">{username}</Text>
                </Button>

                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<HamburgerIcon />}
                        bgGradient="linear(to-r, rgba(115, 41, 123, 0.9), rgb(83, 41, 140, 0.9))"
                        color={'white'}
                        _hover={{
                            opacity: 1,
                            backgroundSize: 'auto',
                            boxShadow: '0 0 20px -2px rgba(195, 111, 199, .5)',
                            transform: 'translate3d(0, -0.5px, 0) scale(1.01)',

                        }}>
                    </MenuButton>

                    <MenuList style={{ padding: 0, margin: 0, border: 'none' }} bgColor="#242424">
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
                            <Text fontSize="lg">Create Stitch</Text>
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
