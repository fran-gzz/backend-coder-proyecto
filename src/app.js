import express from 'express'
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './helpers/passport.config.js';

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/cart.router.js'
import authRouter from './routes/auth.router.js'

import 'dotenv/config.js'
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser())

// Archivos estáticos
app.use(express.static('./src/public'))

// Passport
initializePassport()
app.use(passport.initialize())

// Ruta de sesiones
app.use('/auth', authRouter)

// Ruta de productos
app.use('/products', productsRouter)

// Ruta del carrito
app.use('/carts', cartsRouter)

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