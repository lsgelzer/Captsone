const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dal = require('./dal.js');
const cors = require('cors');

const app = express();

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';


const refreshTokens = [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/login', async (req, res) => {
    console.log(req.body)
    // read username and password from request body
    const {email, password} = req.body
    
   
    // filter user from the users array by email and password
    const users = await dal.find(u => { return u.email === email && u.password === password });
    const user = users.find(u => { return u.email === email && u.password === password });
    console.log(user)
    if (user) {
        // generate an access token
        const accessToken = jwt.sign({ email: user.email }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ email: user.email }, refreshTokenSecret);
        const userName = user.name;
        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken,
            email,
            password,
            userName
            

        });
        console.log(refreshTokens)
    } else {
        res.send('Username or password incorrect');
    }
    
});

app.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
});

app.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.send("Logout successful");
});

app.listen(4000, () => {
    console.log('Authentication service started on port 4000');
});
