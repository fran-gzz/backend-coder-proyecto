import { AuthService, CartService } from '../repositories/index.js';
import { generateToken, createHash } from '../helpers/utils.js'
import { serverErrorResponse } from '../helpers/serverResponses.js';

import CustomError from '../errors/CustomError.js';
import ErrorType from '../errors/error-type.js';
import { typeErrorMessage } from '../errors/error-messages.js';

import logger from '../config/winston.config.js';

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
            logger.info('Inicio de sesión exitoso.');
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
            logger.info('Datos del usuario renovados.');
        }
    } catch ( error ) { serverErrorResponse( res, 500 )}
    
}

/**     LOGOUT     **/
export const userLogout = ( req, res ) => {
    // TODO: Logout de Github
    logger.info('Sesión cerrada.')
    try {
        res.clearCookie( process.env.COOKIE_NAME ).status( 200 ).json({
            ok: true,
            status: 200,
            message: 'El usuario cerró sesión exitosamente.'
        })
    } catch ( error ) { serverErrorResponse( res, 500 )}
}