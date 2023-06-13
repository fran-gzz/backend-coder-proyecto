import { Router } from "express";
import passport from "passport";

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

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/sessions/failRegister'
}), async (req, res) => {
    
    res.redirect('/sessions/login')
})


router.get('/failRegister', (req, res) => {
    res.send({ error: 'Error al registrarse' })
})
// Login
router.get('/login', (req, res) => {
    res.render('sessions/login', {
        pageTitle: 'Iniciar sesión',
    })
})

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/sessions/failLogin'
}), async ( req, res ) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Credenciales invalidas.' })
    }

    if( req.user.email === 'admin@coder.com' ) {
        req.session.user = {
            username: req.user.first_name,
            role: 'admin'
        }
    } else {
        req.session.user = {
            username: req.user.first_name,
            role: 'user'
        }
    }
    res.redirect('/products')
})

router.get('/failLogin', (req, res) => {
    res.send({ error: 'Error al iniciar sesión' })
})

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
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) res.status(500).render('errors/base', {
            error: err
        }) 
        else {
            res.redirect('/sessions/login')
        }
    })
})




export default router;