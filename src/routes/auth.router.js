import { Router } from "express";
import passport from "passport";
import { userRegister, userLogin, userLogout, userLoginView, userRegisterView } from '../controllers/auth.controller.js'

const router = Router()

router.get('/', async (req, res) => {
    res.redirect('/auth/login')
})

// Registro
router.get('/register', userRegisterView ) // Vista del Register (temporal)
router.post( '/register', userRegister )


// Login
router.get( '/login', userLoginView ) // Vista del Login (temporal)
router.post( '/login', userLogin )


// GITHUB LOGIN
// TODO: Refactorizar y reemplazar session por jwt
router.get('/github', passport.authenticate('github', {
    scope: ["user:email"]
}), ( req, res ) => {})

router.get('/githubcallback', passport.authenticate('github', { 
    failureRedirect: '/auth/login'
}), async (req,res) => {
    req.session.user =  {
        ...req.user,
        role: 'user'
    }
    res.redirect('/products')
})

// Logout
router.get( '/logout', userLogout )



export default router;