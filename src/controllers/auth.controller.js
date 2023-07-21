/**
    Proximamente el proyecto será divido entre el backend y el frontend.
    Para cuando termine de desarrollar el frontend en ReactJS, el "res.render" será sustituido por un "res.json".
    Mientras tanto, se usará el "res.render", ya que es correspondiente usar esto en un entorno de handlebars
**/
import Auth from '../dao/auth.dao.js'
import { generateToken, createHash } from '../helpers/utils.js'
import { serverErrorResponse } from '../helpers/serverResponses.js';

const authService = new Auth();



/**     REGISTER     **/
export const userRegister = async ( req, res ) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const user = await authService.getUserByEmail( email )
        if ( user ) {
            return res.status( 400 ).json({
                ok: false,
                status: 400,
                title: 'Error',
                message: 'El email ya está en uso.'
            })
        }
        const newUser =  {
            first_name, last_name, email, age, role: 'user',
            password: createHash( password )
        }

        let result = await authService.registerUser( newUser )

        res.status( 201 ).json({
            ok: true,
            status: 201,
            title: 'Usuario creado',
            message: `Usuario registrado con el ID: ${ result._id }`
        })

    } catch ( error ) { serverErrorResponse( res, 500 )}
}


/**     LOGIN     **/
export const userLogin = async ( req, res ) => {
    const { email } = req.body;
    try {
        const user = await authService.getUserByEmail( email )
        if ( !user ) {
            return res.status( 400 ).json({
                ok: false,
                status: 400,
                title: 'Error',
                message: 'Email inválido.'
            })
        } else {

            const name = user.first_name
            const lastName = user.last_name
            const initials = `${ name?.slice(0, 1)}${ lastName?.slice(0, 1)}`

            const token = await generateToken( user );
            res.status( 200 ).json({
                ok: true,
                status: 200,
                email: user.email,
                uid: user._id,
                username: name,
                initials: initials,
                fullname: `${ name } ${ lastName }`,
                role: user.role,
                token: token
            })
            console.log('Inicio de sesión exitoso.');
        }
    } catch ( error ) { serverErrorResponse( res, 500 )}
}


export const renewToken = async ( req, res ) => {
    const { email } = req;
    try {
        const user = await authService.getUserByEmail( email )
        if ( !user ) {
            return res.status( 400 ).json({
                ok: false,
                status: 400,
                title: 'Error',
                message: 'No se encontró un usuario con el email proporcionado.'
            })
        } else {
            const name = user.first_name
            const lastName = user.last_name
            const initials = `${ name?.slice(0, 1)}${ lastName?.slice(0, 1)}`

            const token = await generateToken( user );
            res.status( 200 ).json({
                ok: true,
                status: 200,
                email: user.email,
                uid: user._id,
                username: name,
                initials: initials,
                fullname: `${ name } ${ lastName }`,
                role: user.role,
                token: token
            })
            console.log('Datos del usuario renovados.');
        }
    } catch ( error ) { serverErrorResponse( res, 500 )}
    
}


/**     LOGOUT     **/
export const userLogout = ( req, res ) => {
    // TODO: Logout de Github
    console.log('Sesión cerrada.')
    try {
        res.clearCookie( process.env.COOKIE_NAME ).status( 200 ).json({
            ok: true,
            status: 200,
            title: 'Acción completada',
            message: 'El usuario cerró sesión satisfactoriamente.'
        })
    } catch ( error ) { serverErrorResponse( res, 500 )}
}