import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
    const navigate = useNavigate()

    const handleLogout = () => {
        try {
            fetch('http://localhost:3000/logout', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('refreshToken')
                })
            })
            
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            navigate('/')
        } catch (error) {
            alert('Failed to logout')
        }
    }
    
    return (
        <div className='Home'>
            <button className='profileIcon'>Profile</button>
            <h1>RetroBeat</h1>
            <p>Create Cassette</p>
            <button className='logout' onClick={handleLogout}>Log Out</button>
        </div>
    )
}

export default Home
