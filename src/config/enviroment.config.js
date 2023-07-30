import dotenv from 'dotenv'
dotenv.config()

export default {
    apiserver: {
        port: process.env.PORT
    },
    mongo: {
        uri: process.env.MONGO_URL,
        dbname: process.env.MONGO_NAME
    },
    persistance: process.env.PERSISTANCE,
    enviroment: process.env.ENVIROMENT
}