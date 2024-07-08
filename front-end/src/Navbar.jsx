import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Box, Flex, Spacer, Heading, Text } from "@chakra-ui/react";
import './Navbar.css'

function Navbar({ username }) {
    const navigate = useNavigate()
    const [isDropdownVisible, setDropdownVisible] = useState(false)

    const handleHome = () => {
        navigate(`/${username}`)
    }

    const handleCreate = () => {
        navigate(`/${username}/create`)
    }

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
            })

            localStorage.removeItem('access_token')
            navigate('/')
        } catch (error) {
            alert('Failed to logout')
        }
    }

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    }

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    }

    return (
        <Box w="70%" color="white" p={4} mx="auto">
            <Flex align="center">
                <button className="profileIcon">
                    <Text fontSize={'lg'}>Profile</Text>
                </button>
                <Spacer />
                <Heading as='h1' size='2xl' style={{ textAlign: 'center', flexGrow: 1 }}>SoundStitch</Heading>
                <Spacer />
                <div
                    className="menu"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="dropdownButton">
                        <Text fontSize={'lg'}>Menu</Text>
                    </button>
                    {isDropdownVisible && (
                        <div className="dropdownMenu" style={{ position: 'absolute', right: 0 }}>
                            <ul>
                                <li onClick={handleHome}>
                                    <Text fontSize={'md'}>Home</Text>
                                </li>
                                <li onClick={handleCreate}>
                                    <Text fontSize={'md'}>Create</Text>
                                </li>
                                <li onClick={handleLogout}>
                                    <Text fontSize={'md'}>Logout</Text>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </Flex>
        </Box>
    )
}

export default Navbar
