const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.enable('trust proxy');

const User = require('./model/User')

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
    const newUser = new User()
    newUser.name = req.body.name
    newUser.email = req.body.email
    newUser.password = req.body.password

    newUser.save()

    res.send(newUser)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/emailauthentication', (req, res) => {
    res.send('E-mail Authentication')
})