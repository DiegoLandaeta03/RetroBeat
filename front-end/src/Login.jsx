import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Login.css'

function Login() {
    const [email, setEmail] = useState("");
    const [username, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");
    const navigate = useNavigate()

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangeUser = (e) => {
        setUser(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleCreate = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),
            })
            .then(response => response.json())
            .then(result => {
                if (result.success == true) {
                    const accessToken = result.accessToken
                    const refreshToken = result.refreshToken
                    localStorage.setItem('accessToken', accessToken)
                    localStorage.setItem('refreshToken', refreshToken)
                    setResult('')
                    navigate(`/${username}`)
                }
                else{
                    setResult("Failed to create, try again or log in!")
                }
            })
            .catch(error => {
                setResult("Failed to create account!");
            });
    }

    const handleLogin = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            })
            .then(response => response.json())
            .then(result => {
                if (result.success == true) {
                    const accessToken = result.accessToken
                    const refreshToken = result.refreshToken
                    localStorage.setItem('accessToken', accessToken)
                    localStorage.setItem('refreshToken', refreshToken)
                    setResult('')
                    navigate(`/${username}`)
                }
                else{
                    setResult("Failed to login, try again or create an account!")
                }
            })
            .catch(error => {
                setResult("Failed to login!");
            });
    }
    
    return (
        <div className='Login'>
            <header>
                <h1 className='loginTite'>RetroBeat</h1>
            </header>

            <main>
                <h2 className='signUp'>Sign Up / Create Account </h2>
                <div>
                    <label className='labels'>email: </label>
                    <input onChange={handleChangeEmail} placeholder='email@gmail.com' value={email}></input>
                </div>
                <div>
                    <label className='labels'>username: </label>
                    <input onChange={handleChangeUser} placeholder='diegolandaeta' value={username}></input>
                </div>
                <div>
                    <label className='labels'>password:</label>
                    <input onChange={handleChangePassword} placeholder='password123' value={password}></input>
                </div>
                <button className='loginButton' onClick={handleCreate}>Create</button>
                <button className='loginButton' onClick={handleLogin}>Login</button>
                <div>
                    {result && <p className='result'>{result}</p>}
                </div>
            </main>
        </div>
    )
}

export default Login
