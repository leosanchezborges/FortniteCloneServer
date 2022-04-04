const uuid = require('uuid')
const redis = require("redis")
const redisClient = redis.createClient({
    host: process.env.REDIS_ENDPOINT
})

module.exports = class User {

    constructor() {
        this.name = null
        this.email = null
        this.password = null
    }

    save() {
        this.id = this.email

        redisClient.hset("Users", this.id, JSON.stringify(this), function (err) {
            if (err) {
                console.error("Failed to store user in redis: ", err, this)
                return
            }
        })

        console.log("Usuario salvo com sucesso!", this.id);
    }

    static async load(id, callback) {
        redisClient.hget("Users", id, function (err, user) {
            if (err) {
                console.log("Deu merda!", err);
                return null;
            }

            callback(user);
        })
    }
}