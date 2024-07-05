import Navbar from './Navbar'
import './Home.css'
import { useParams } from 'react-router-dom'

function Home() {
    const params = useParams();
    const username = params.username;

    return (
        <div className='Home'>
            <header>
                <Navbar username={username}/>
            </header>
            <main>
                <div className='beatTitle'>
                    <h2>Your Beats</h2>
                </div>
                
            </main>
        </div>
    )
}

export default Home
