var redis = require("redis")
var uuid = require('uuid')
const table = "fortnite"
const enableLogs = true
const maxPercent = 70

function getTable(UserEventID = 0) {
    return `${table}_${UserEventID}`
}

function Presence() {
    this.client = redis.createClient({
        host: process.env.REDIS_ENDPOINT,
    })
}

Presence.prototype.updateGameProperties = function (data) {
    const redis = this.client
    const tbl = `gamesessions`
    const gameSessionName = `${data.event}-${data.venue}`

    redis.hget(tbl, gameSessionName, function (err, gameSession) {
        let venue = {}

        if (gameSession)
            venue = JSON.parse(gameSession)

        venue.gameProperties = data.gameProperties
        venue.when = Date.now()

        redis.hset(tbl, gameSessionName, JSON.stringify(venue), function (err) {
            if (err)
                console.error("Failed to store company in redis: " + err, venue.when)
            else {
                console.log('UpdateGameProperties')
                console.log(JSON.stringify(data))
                console.log(gameSessionName, 'foi atualizado')
            }
        })
    })
}

Presence.prototype.postLoginLogout = function (data, callback) {
    const redis = this.client
    const tbl = `gamesessions`
    const gameSessionName = `${data.event}-${data.venue}`

    redis.hget(tbl, gameSessionName, function (err, gameSession) {
        let newGameProperties = null

        if (gameSession) {
            const venue = JSON.parse(gameSession)
            console.log("Before:", (!venue.gameSession) ? JSON.stringify({}) : JSON.stringify(venue.gameSession))

            // CASO A LISTA DE GAMESESSION NAO EXISTA DEVEMOS CRIAR
            if (!('gameSession' in venue))
                venue.gameSession = {}

            // CASO DETERMINADA GAMESESSION NAO EXISTA DEVEMOS
            // CRIAR E DEFINIR O CONTADOR PARA ZERO
            if (!(data.gameSession in venue.gameSession))
                venue.gameSession[data.gameSession] = 0

            // INCREMENTAMOS OU DECREMENTAMOS CASO O JOGADOR
            // ESTEJA REALOZANDO A ENTRADA OU SAIDA REMOVE CASO ZERE
            if (data.isJoining && venue.gameSession[data.gameSession] < venue.gameProperties.MaxPlayersNum)
                venue.gameSession[data.gameSession]++
            else if (!data.isJoining)
                venue.gameSession[data.gameSession]--

            if (venue.gameSession[data.gameSession] <= 0)
                delete venue.gameSession[data.gameSession]

            // VERIFICA SE A PORCENTAGEM MAX FOI ATINGIDA
            const hasSessions = Object.keys(venue.gameSession).length > 0
            const canCreateMoreSessions = venue.gameProperties.MaxPlayersNum > 0 && Object.keys(venue.gameSession).length < venue.gameProperties.MaxReplicas + 1

            if (venue.gameProperties.MaxReplicas == 0) {
                callback(newGameProperties)
                return;
            }

            if (hasSessions) {

                let arr = []
                const keys = Object.keys(venue.gameSession)
                for (let index = 0; index < keys.length; index++) {

                    if (venue.gameSession[keys[index]] < venue.gameProperties.MaxPlayersNum)
                        arr.push(keys[index])

                    if (arr.length >= 2)
                        break
                }

                if (arr.length == 1) {
                    const percent = (venue.gameSession[arr[0]] / venue.gameProperties.MaxPlayersNum) * 100
                    const spercent = Math.round((percent + Number.EPSILON) * 100) / 100
                    console.log(spercent + '%')

                    if (percent >= maxPercent) {
                        newGameProperties = { ...venue.gameProperties }
                        newGameProperties.gamesessionWebsocketName = uuid.v4()
                        newGameProperties.Event = data.event
                        venue.gameSession[newGameProperties.gamesessionWebsocketName] = 0
                    }
                } else if (arr.length == 0 && hasSessions) {
                    newGameProperties = { ...venue.gameProperties }
                    newGameProperties.gamesessionWebsocketName = uuid.v4()
                    newGameProperties.Event = data.event
                    venue.gameSession[newGameProperties.gamesessionWebsocketName] = 0
                }
            }

            // ATUALIZA O BANCO DE DADOS
            redis.hset(tbl, gameSessionName, JSON.stringify(venue), function (err) {
                if (err) {
                    console.error("Failed to store company in redis: " + err, venue.when)
                    callback(null)
                    return
                }

                if (enableLogs) {
                    redis.hget(tbl, gameSessionName, function (err, result) {
                        console.log("After:", JSON.stringify(JSON.parse(result).gameSession))
                    })
                }

                callback(newGameProperties)
            })
        } else {
            callback(newGameProperties)
        }
    })
}

Presence.prototype.upsert = function (connectionId, meta, UserEventID) {
    this.client.hset(getTable(UserEventID), connectionId, JSON.stringify({ meta: meta, when: Date.now(), }), function (err) {
        if (err) {
            console.error("Failed to store presence in redis: " + err)
        }
    }
    )
}

Presence.prototype.list = function (returnPresent, UserEventID) {
    var active = []
    var dead = []
    var now = Date.now()
    var self = this

    this.client.hgetall(getTable(UserEventID), function (err, presence) {
        if (err) {
            console.error("Failed to get presence from Redis: " + err)
            return returnPresent([])
        }

        for (var connection in presence) {
            var details = JSON.parse(presence[connection])
            details.connection = connection

            if (now - details.when > 8000) {
                dead.push(details)
            } else {
                active.push(details.meta)
            }
        }

        if (dead.length) {
            self._clean(dead)
        }

        return returnPresent(active)
    })
}

Presence.prototype._clean = function (toDelete) {
    for (var presence of toDelete) {
        this.remove(presence.connection, presence.meta.user.UserEventID)
    }
}

Presence.prototype.remove = function (connectionId, UserEventID) {
    this.client.hdel(getTable(UserEventID), connectionId, function (err) {
        if (err) {
            console.error("Failed to remove presence in redis: " + err)
        }
    })
}

module.exports = new Presence()
