import { app, env } from './config/config.js'
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './helpers/passport.config.js';
import errorHandler from './middlewares/error-handler.middleware.js';
import logger from './config/winston.config.js';
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'


import { authRouter, productsRouter, cartRouter } from './routes/router.js';




// Passport
initializePassport()
app.use( passport.initialize())

// Swagger: Documentación de la API
const swaggerOptions = {

    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de la API del ecommerce',
        }
    },
    apis: [`./docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


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
    app.listen( env.apiserver.port , () => {
        logger.http(`Listening on http://localhost:${ env.apiserver.port }`)
    });
} catch ( error ) { logger.error('Hubo un error al conectarse con la base de datos.')}