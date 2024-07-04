import './SpotifyLogin.css'

function SpotifyLogin() {
    return (
        <div className="SpotifyLogin">
            <header className="spotify-login-header">
                <a className="btn-spotify" href="http://localhost:3000/auth/login" >
                    Login with Spotify 
                </a>
            </header>
        </div>
    );
}

export default SpotifyLogin
