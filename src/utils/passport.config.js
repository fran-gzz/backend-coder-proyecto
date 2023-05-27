import passport from "passport";
import local from 'passport-local'
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";

import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async ( req, username, password, done ) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            const user = await userModel.findOne({ email: username })
            if( user ) {
                console.log('El usuario ya existe');
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, email, age,
                password: createHash( password )
            }

            const result = await userModel.create( newUser );
            return done( null, result )

        } catch( err ) {
            return done('Error al leer la base de datos.')
        }
    }))
    
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async ( username, password, done ) => {
        try {
            const user = await userModel.findOne({ email: username })
            if( !user ) {
                console.log('El usuario no existe');
                return done( null, user )
            }
            if( !isValidPassword( user, password )){
                return done( null, false )
            }

            return done( null, user )

        } catch ( err ) {
            return done('Error al leer la base de datos.')
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.22f3bfb4ac312463',
        clientSecret: '74f12aa2bae5de7dd0dd946e1fa462d4886b5167',
        callbackURL: 'http://localhost:8080/sessions/githubcallback',
    }, async( accessToken, refreshToken, profile, done ) => {
        console.log( profile );
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if( user ) {
                return done( null, user )
            }

            const newUser = await userModel.create({
                first_name: profile._json.name,
                email: profile._json.email
            })

            return done( null, newUser )
            
        } catch ( err ) {
            return done('Error al iniciar sesión con Github')
        }
    }))



    // Serialización del usuario
    passport.serializeUser(( user, done ) => {
        done( null, user._id )
    })

    // Deserialización del usuario
    passport.deserializeUser( async ( id, done ) => {
        const user = await userModel.findById( id )
        done( null, user )
    })
}

export default initializePassport