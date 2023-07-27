import passport from "passport";
import passport_jwt from 'passport-jwt'
import { userModel } from '../dao/models/models.js'
import { extractCookie } from "../helpers/utils.js";

import GitHubStrategy from 'passport-github2'

const JWTStrategy = passport_jwt.Strategy;
const ExtractJWT = passport_jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([ extractCookie ]),
        secretOrKey: process.env.JWT_PRIVATE_KEY
    }, async ( jwt_payload, done ) => {
        try {
            return done( null, jwt_payload )
        } catch ( error ) {
            return done( error )
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

export default initializePassport;