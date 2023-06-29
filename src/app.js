import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './utils/passport.config.js';

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/cart.router.js'
import sessionRouter from './routes/session.router.js'
import adminRouter from './routes/admin.router.js'



import 'dotenv/config.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Motor de plantillas
app.engine('.hbs', handlebars.engine({extname: '.hbs'}))
app.set('views', './src/views')
app.set('view engine', '.hbs')

// Archivos estáticos
app.use(express.static('./src/public'))

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        dbName: process.env.MONGO_NAME
    }),
    secret: 'supersecret',
    resave: true,
    saveUninitialized: true
}))

// Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    // Valida si el usuario está logueado
    res.locals.loggedIn = req.session.user ? true : false;
    // Valida si el usuario es administrador
    res.locals.isAdmin = req.session.user?.role === 'admin' ? true : false;
    next();
});


// Redirect a ruta de productos
app.get('/', (req, res) => {
    res.redirect('/sessions/login')
})

// Ruta de productos
app.use('/products', productsRouter)

// Ruta del carrito
app.use('/carts', cartsRouter)

// Ruta de sesiones
app.use('/sessions', sessionRouter)

app.use('/admin', adminRouter)


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