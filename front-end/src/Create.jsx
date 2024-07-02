import { useParams } from 'react-router-dom'
import './Create.css'
import Navbar from './Navbar'

function Create() {
    const params = useParams();
    const username = params.username;

    return (
        <div className='Create'>
            <header>
                <Navbar username={username}/>
            </header>
        </div>
    )
}

export default Create
