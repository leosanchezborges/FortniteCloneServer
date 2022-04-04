const uuid = require('uuid')
const redis = require("redis")
const redisClient = redis.createClient({
    host: process.env.REDIS_ENDPOINT
})

module.exports = class Game {

    constructor() {
        this.id = null
        this.roomName = null
        this.roomPassword = null

    }

    save() {
        const id = uuid.v4()
        this.id = id

        redisClient.hset("Rooms", id, JSON.stringify(this), function (err) {
            if (err) {
                console.error("Failed to store room in redis: ", err, this)
                return
            }
        })

        console.log("Sala salva com sucesso!");
    }
}