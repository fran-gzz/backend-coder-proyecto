import { app, env } from './config/config.js'
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './helpers/passport.config.js';
import { authRouter, productsRouter, cartRouter } from './routes/router.js';
import errorHandler from './middlewares/error-handler.middleware.js';

// Passport
initializePassport()
app.use( passport.initialize())

// Rutas
app.use('/api/auth', authRouter )
app.use('/api/products', productsRouter )
app.use('/api/carts', cartRouter )

app.use( errorHandler )

// Conexión a base de datos y al localhost
try {
    await mongoose.connect( env.mongo.uri, {
        dbName: env.mongo.dbname,
    })
    console.log('Database conected.');
    app.listen( env.apiserver.port , () => {
        console.log(`Listening on http://localhost:${ env.apiserver.port }`)
    });
} catch ( error ) { console.log('Hubo un error al conectarse con la base de datos.')}