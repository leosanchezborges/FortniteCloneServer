const uuid = require('uuid')
const redis = require("redis")
const redisClient = redis.createClient({
    host: process.env.REDIS_ENDPOINT
})

module.exports = class Leaderboard {

    constructor() {
        this.podiumFirst = null
        this.podiumSecond = null
        this.podiumThird = null
        this.firstKillCount = null
        this.secondKillCount = null
        this.thirdKillCount = null
        this.firstUsername = null
        this.secondUsername = null
        this.thirdUsername = null
    }

    save() {
        const id = uuid.v4()
        this.id = id

        redisClient.hSet('Leaderboard', id, JSON.stringify(this), function (err) {
            if (err) {
                console.error('Failed to store podium in redis', err, this)
                return
            }
        })
        console.log("Leaderboard Atualizada!");
    }
    static find(id) {
        redis.hget('Leaderboard', id, function (err, data) {
            console.log(data);
        })
    }



}