const express = require('express')
const request = require('request')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()

router.use(express.json())

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

router.get('/login', (req, res) => {
    var scope = "user-read-email \
                user-top-read \
                user-read-recently-played\
                playlist-modify-public \
                ugc-image-upload"

    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: "http://localhost:5173/auth/callback",
        state: state,
        show_dialog: true
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

router.post('/exchange_code', (req, res) => {
    const { code } = req.body;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: "http://localhost:5173/auth/callback",
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({ error: body });
        }
        res.json({ access_token: body.access_token });
    });
});

router.get('/token', (req, res) => {
    res.json(
        {
            access_token: access_token
        })
})

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

module.exports = router
