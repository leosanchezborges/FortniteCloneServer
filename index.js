const express = require('express')
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
    res.send('Página Inicial')
})

app.get('/signin', (req, res) => {
    res.send('Sign In')
})

app.get('/signout', (req, res) => {
    res.send('Sign Out')
})

app.get('/signup', (req, res) => {
    res.send('Sign Up')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/emailauthentication', (req, res) => {
    res.send('E-mail Authentication')
})