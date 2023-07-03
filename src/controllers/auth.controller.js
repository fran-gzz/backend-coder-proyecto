/**
    Proximamente el proyecto será divido entre el backend y el frontend.
    Para cuando termine de desarrollar el frontend en ReactJS, el "res.render" será sustituido por un "res.json".
    Mientras tanto, se usará el "res.render", ya que es correspondiente usar esto en un entorno de handlebars
**/

import userModel from '../models/user.model.js'
import { generateToken, createHash } from '../helpers/utils.js'

export const userRegisterView = (req, res) => {
    res.render('auth/register', {
        pageTitle: 'Registrar usuario'
    })
}
/**     REGISTER     **/
export const userRegister = async ( req, res ) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if ( user ) {
            return res.status( 400 ).json({
                ok: false,
                title: 'Error',
                message: 'El email ya está en uso.'
            })
        }

        const newUser =  {
            first_name, last_name, email, age, role: 'user',
            password: createHash( password )
        }

        await userModel.create( newUser )

        /* 
        res.status( 201 ).json({
            ok: true,
            title: 'Usuario registrado en la base de datos.',
        })
        */
        console.log('Usuario registrado con éxito')
        res.status( 201 ).redirect('/auth/login')

    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}

export const userLoginView = ( req, res ) => {
    res.render('auth/login', {
        pageTitle: 'Iniciar sesión',
    })
}
/**     LOGIN     **/
export const userLogin = async ( req, res ) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email })
        if ( !user ) {
            return res.status( 400 ).json({
                ok: false,
                title: 'Error',
                message: 'Email inválido.'
            })
        }

        console.log('Sesión iniciada con éxito');
        const token = generateToken( user );
        user.token = token
        res.cookie( process.env.COOKIE_NAME, user.token ).redirect('/products')

    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}


/**     LOGOUT     **/
export const userLogout = ( req, res ) => {
    // TODO: Logout de Github
    res.clearCookie(process.env.COOKIE_NAME).redirect('/auth/login')
    console.log('Sesión cerrada')
}