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
    const NewUser = new User()

    NewUser.name = req.body.name
    NewUser.email = req.body.email
    NewUser.password = req.body.password

    if (NewUser.email == null || NewUser.email == '') {
        res.send({
            error: "Esqueceu o email, foi?"
        })
        return
    }

    if (NewUser.name == null || NewUser.name == '') {
        res.send({
            error: "Esqueceu o nome, foi?"
        })
        return
    }

    if (NewUser.password == null || NewUser.password == '') {
        res.send({
            error: "ESQUECER A SENHA EU ACHAVA QUE ERA IMPOSSIVEL, MAS VOCE ME SURPREENDEU"
        })
        return
    }

    NewUser.save((user) => {
        if (user == null) {
            res.send({
                error: "Erro ao criar um novo usuario seu imbecil"
            })

        }

        delete user.password
        res.send(user)

    })

})

app.get('/emailauthentication', (req, res) => {
    res.send('E-mail Authentication')
})


// =========================================
// TESTES TEMPORARIOS
// =========================================