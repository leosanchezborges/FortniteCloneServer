// =========================================
// IMPORTACAO DE BIBLIOTECAS https://dynamoosejs.com/getting_started/Import
// =========================================
const dynamoose = require("dynamoose");
const uuid = require('uuid');

// =========================================
// CONFIGURA HOST DO BANCO DE DADOS
// =========================================
// const urldyNamodb = `${process.env.DYNAMO_ENDPOINT}:${process.env.DYNAMO_PORT}`;

dynamoose.aws.sdk.config.update({
    region: 'us-east-1',
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
});

dynamoose.aws.ddb.local();

// =========================================
// CONFIGURA OS CAMPOS DA TABELA
// =========================================
const FUser = new dynamoose.Schema(
    {
        id: {
            type: String,
            hashKey: true,
            default: uuid.v4,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    });

module.exports = dynamoose.model(`FUser`, FUser);