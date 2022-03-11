const express = require('express')
const redis = require('redis');
const redisClient = redis.createClient(6379);

redisClient.on('error', (err) => {
    console.log(err);
});

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Página Inicial')
})

app.post('/signin', (req, res) => {
    res.send('Sign In')
})

app.get('/signout', (req, res) => {
    res.send('Sign Out')
})

app.post('/signup', (req, res) => {
    res.send('Sign Up')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/emailauthentication', (req, res) => {
    res.send('E-mail Authentication')
})