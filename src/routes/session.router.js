import { Router } from "express";
import passport from "passport";
import { generateToken, createHash } from "../helpers/utils.js";
import userModel from "../models/user.model.js";


const router = Router()

router.get('/', async (req, res) => {
    res.redirect('/sessions/login')
})

// Registro
router.get('/register', (req, res) => {
    res.render('sessions/register', {
        pageTitle: 'Registrar usuario'
    })
})


router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    const user = await userModel.findOne({ email })
    if( user ) {
        return res.status( 400 ).json({ 
            status: 'error', 
            error: 'User already exists' 
        });
    }
    const newUser = {
        first_name, last_name, email, age, role: 'user',
        password: createHash( password )
    }
    const result = await userModel.create( newUser );

    const access_token = generateToken( result );
    res.json({ status: 'success', access_token })
})


// Login
router.get('/login', (req, res) => {
    res.render('sessions/login', {
        pageTitle: 'Iniciar sesión',
    })
})

router.post('/login', async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email })
    if( !user ) return res.status(400).json({
        ok: false,
        error: 'Credenciales inválidas'
    })
    const token = generateToken( user );
    user.token = token
    res.cookie(process.env.COOKIE_NAME, user.token  ).redirect('/products')
})


// GITHUB LOGIN
// TODO: Refactorizar y reemplazar session por jwt
router.get('/github', passport.authenticate('github', {
    scope: ["user:email"]
}), ( req, res ) => {})

router.get('/githubcallback', passport.authenticate('github', { 
    failureRedirect: '/sessions/login'
}), async (req,res) => {
    req.session.user =  {
        ...req.user,
        role: 'user'
    }
    res.redirect('/products')
})


// Logout

router.get('/logout', ( req, res ) => {
    // TODO: Logout de Github
    res.clearCookie(process.env.COOKIE_NAME).redirect('/sessions/login')
    console.log('Sesión cerrada')
})



export default router;