import Navbar from './Navbar'
import './Home.css'
import { Heading } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

function Home() {
    const params = useParams();
    const username = params.username;

    return (
        <div className='Home'>
            <header>
                <Navbar username={username} />
            </header>
            <main>
                <div className='beatTitle'>
                    <Heading as='h2' size='2xl'>Your Beats</Heading>
                </div>

            </main>
        </div>
    )
}

export default Home
