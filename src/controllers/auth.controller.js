import { AuthService, CartService } from '../repositories/index.js';
import { generateToken, createHash, generateRandomString } from '../helpers/utils.js'
import { serverErrorResponse } from '../helpers/serverResponses.js';

import CustomError from '../errors/CustomError.js';
import ErrorType from '../errors/error-type.js';
import { typeErrorMessage } from '../errors/error-messages.js';

import UserPasswordModel from '../dao/models/user-password.model.js';

import logger from '../config/winston.config.js';
import nodemailer from 'nodemailer';
import userModel from '../dao/models/user.model.js';


/**     REGISTER     **/
export const userRegister = async ( req, res ) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {

        if( !first_name || !last_name || !email || !age || !password ){
            CustomError.createError({
                name: 'Error en la creación del usuario',
                cause: typeErrorMessage({ first_name, last_name, email, age, password }, 'register'),
                message: 'Error al intentar crear el usuario.',
                code: ErrorType.INVALID_TYPES_ERROR
            })
        }

        const user = await AuthService.readOne( email );
        if ( user !== null ) {

            logger.warning('El email ya está en uso')

            return res.status( 400 ).json({
                ok: false,
                status: 400,
                message: 'El email ya está en uso.'
            })
        } else {
            const newCart = await CartService.create()
            const newUser =  {
                first_name, last_name, email, age, role: 'user', cart: newCart._id,
                password: createHash( password )
            }
            let result = await AuthService.create( newUser )
            
            logger.info(`Usuario registrado con el ID: ${ result._id }`)
            
            res.status( 201 ).json({
                ok: true,
                status: 201,
                message: `Usuario registrado con el ID: ${ result._id }`
            })
        }
    } catch ( error ) { 
        logger.error(error.message)
        logger.error(error.cause);
        serverErrorResponse( res, 500 )
    }
}

/**     LOGIN     **/
export const userLogin = async ( req, res ) => {
    const { email, password } = req.body;
    try {

        if( !email || !password ){
            CustomError.createError({
                name: 'Error al iniciar sesión.',
                cause: typeErrorMessage({ email, password }, 'login'),
                message: 'Error al intentar iniciar sesión.',
                code: ErrorType.INVALID_TYPES_ERROR
            })
        }

        const user = await AuthService.readOne( email );

        if ( !user ) {
            
            logger.warning('El usuario no existe')

            return res.status( 400 ).json({
                ok: false,
                status: 400,
                message: 'El usuario no existe.'
            })
        } else {
            
            const name = user.first_name
            const lastName = user.last_name
            const initials = `${ name?.slice(0, 1)}${ lastName?.slice(0, 1)}`

            const token = await generateToken( user );
            res.status( 200 ).json({
                cid: user.cart,
                email: user.email,
                fullname: `${ name } ${ lastName }`,
                initials: initials,
                role: user.role,
                token: token,
                uid: user._id,
                username: name,
            })
            logger.http('Inicio de sesión exitoso.');
        }
    } catch ( error ) { 
        logger.error(error.message)
        logger.error(error.cause);
        serverErrorResponse( res, 500 )
    }
}

/**     Renovación del token     **/
export const renewToken = async ( req, res ) => {
    const { email } = req;
    try {
        const user = await AuthService.readOne( email );
        if ( !user ) {
            
            logger.warning('El usuario no existe')

            return res.status( 400 ).json({
                ok: false,
                status: 400,
                message: 'El usuario no existe.'
            })
        } else {
            const name = user.first_name
            const lastName = user.last_name
            const initials = `${ name?.slice(0, 1)}${ lastName?.slice(0, 1)}`

            const token = await generateToken( user );
            res.status( 200 ).json({
                cid: user.cart,
                email: user.email,
                fullname: `${ name } ${ lastName }`,
                initials: initials,
                role: user.role,
                token: token,
                uid: user._id,
                username: name,
            })
            logger.http('Datos del usuario renovados.');
        }
    } catch ( error ) { serverErrorResponse( res, 500 )}
    
}

/**     LOGOUT     **/
export const userLogout = ( req, res ) => {
    // TODO: Logout de Github
    logger.http('Sesión cerrada.')
    try {
        res.clearCookie( process.env.COOKIE_NAME ).status( 200 ).json({
            ok: true,
            status: 200,
            message: 'El usuario cerró sesión exitosamente.'
        })
    } catch ( error ) { serverErrorResponse( res, 500 )}
}


/**     Reestablecer contraseña     **/
export const renewPassword = async ( req, res ) => {

    const email = req.body.email
    const user = await AuthService.readOne( email )
    if ( !user ) {
        return res.status(404).json({ status: 'error', error: 'User not found' })
    }

    const token = generateRandomString(16);
    await UserPasswordModel.create({ email, token })

    const mailerConfig = {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    }

    let transporter = nodemailer.createTransport( mailerConfig )

    let message = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '[STORE] Reestablecer la contraseña',
        html: `<h1>[STORE] Reestablecer la contraseña</h1><hr />
        Solicitaste reestablecer tu contraseña. Podes hacerlo desde aquí: <a href="http://localhost:8080/reset-password/${token}">http://localhost:8080/reset-password/${token}</a><hr /> <br> <p>Si no lo solicitaste, ignora este mensaje</p>`
    }

    try {
        await transporter.sendMail(message)
        res.json({ status: 'success', message: `Email enviado a ${email}.` })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const verifyUserToken = async(req, res) => {
    const userPassword = await UserPasswordModel.findOne({ token: req.params.token })
    if (!userPassword) {
        return res.status(404).json({ status: 'error', error: 'Token no válido / El token ha expirado' })
    }
    const user = userPassword.email
    res.json( user )
}

export const resetPassword = async ( req, res ) => {
    try {
        const user = await AuthService.readOne({ email: req.params.email })
        await AuthService.update(user._id, { password: createHash( req.body.password )})
        res.json({ status: 'success', message: 'Se ha cambiado la contraseña' })
        await UserPasswordModel.deleteOne({ email: req.params.user })
    } catch( err ){
        res.json({ status: 'error', error: err.message })
    }
}

/**     Premium     **/

export const updateToPremium = async ( req, res ) => {
    try {
        const user = await AuthService.readOne({ email: req.params.email })
        await AuthService.update(user._id, { role: user.role === 'user' ? 'premium' : 'user' })
        res.json({ status: 'success', message: 'Se ha actualizado el rol del usuario' })
    } catch(err) {
        res.json({ status: 'error', error: err.message })
    }
}