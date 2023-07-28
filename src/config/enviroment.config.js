import dotenv from 'dotenv'
dotenv.config()

export default {
    apiserver: {
        port: process.env.PORT
    },
    persistance: process.env.PERSISTANCE,
    mongo: {
        uri: process.env.MONGO_URL,
        dbname: process.env.MONGO_NAME
    }
}