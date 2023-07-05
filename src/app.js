import express from 'express'
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './helpers/passport.config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { authRouter, productsRouter, cartRouter } from './routes/router.js';
import 'dotenv/config.js'

const app = express();

// Configuraciones 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors())
app.use(express.static('./src/public' ))

// Passport
initializePassport()
app.use(passport.initialize())

// Rutas
app.use('/api/auth', authRouter )
app.use('/api/products', productsRouter )
app.use('/api/carts', cartRouter )

// Conexión a base de datos y al localhost
try {
    await mongoose.connect( process.env.MONGO_URL, {
        dbName: process.env.MONGO_NAME,
    })
    console.log('DB Connected.')
    app.listen( 
        process.env.PORT , () => {
            console.log(`Listening on http://localhost:${ process.env.PORT }`)
        });
} catch ( error ) { console.log('Hubo un error al conectarse con la base de datos.')}