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
        </div>
    )
}

export default Home
