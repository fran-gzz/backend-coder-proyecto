import { app, env } from './config/config.js'
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './helpers/passport.config.js';
import errorHandler from './middlewares/error-handler.middleware.js';
import logger from './config/winston.config.js';
import { authRouter, productsRouter, cartRouter } from './routes/router.js';

// Passport
initializePassport()
app.use( passport.initialize())

// Rutas
app.use('/api/auth', authRouter )
app.use('/api/products', productsRouter )
app.use('/api/carts', cartRouter )

// Ruta de prueba para loggers
app.get('/loggerTest', (req, res) => {
    logger.debug('debug')
    logger.http('http')
    logger.info('info')
    logger.warning('warning')
    logger.error('error')
    logger.fatal('fatal')
})

// Controlador de errores
app.use( errorHandler )

// Conexión a base de datos y al localhost
try {
    await mongoose.connect( env.mongo.uri, {
        dbName: env.mongo.dbname,
    })
    logger.info('Database conected.');
    app.listen( env.apiserver.port , () => {
        logger.info(`Listening on http://localhost:${ env.apiserver.port }`)
    });
} catch ( error ) { logger.error('Hubo un error al conectarse con la base de datos.')}