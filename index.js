// =========================================
// IMPORTACAO DE BIBLIOTECAS
// =========================================
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const User = require("./models/user")

// =========================================
// CONFIGURACAO DO SERVIDOR
// =========================================
const port = process.env.PORT || 3000
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors())
app.enable('trust proxy');
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// =========================================
// DEFINICAO DAS ROTAS DE ACESSO
// =========================================
app.get('/', (req, res) => {
    res.send('Página Inicial')
})

app.post('/signin', (req, res) => {

    const senha = req.body.password
    const user1 = User.load(req.body.email, (user) => {

        if (user == null) {
            res.send({
                error: "Email e senha nao correspondem"
            })
            return;
        }

        user = JSON.parse(user)

        if (user.password == senha) {
            delete user.password
            res.send(user)
        } else {
            res.send({
                error: "Email e senha nao correspondem"
            })
        }
    })
})

app.get('/signout', (req, res) => {
    res.send('Sign Out')
})

app.post('/signup', (req, res) => {
    res.send('Sign Up')
})

app.get('/emailauthentication', (req, res) => {
    res.send('E-mail Authentication')
})


// =========================================
// TESTES TEMPORARIOS
// =========================================