/**
    Proximamente el proyecto será divido entre el backend y el frontend.
    Para cuando termine de desarrollar el frontend en ReactJS, el "res.render" será sustituido por un "res.json".
    Mientras tanto, se usará el "res.render", ya que es correspondiente usar esto en un entorno de handlebars
**/
import Auth from '../dao/auth.dao.js'
import { generateToken, createHash } from '../helpers/utils.js'
import { serverErrorResponse } from '../helpers/serverResponses.js';

const authService = new Auth();

export const userRegisterView = (req, res) => {
    res.render('auth/register', {
        pageTitle: 'Registrar usuario'
    })
}
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

        await authService.registerUser( newUser )

        res.status( 201 ).redirect('/auth/login')

    } catch ( error ) { serverErrorResponse( res, 500 )}
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
        const user = await authService.getUserByEmail( email )
        if ( !user ) {
            return res.status( 400 ).json({
                ok: false,
                title: 'Error',
                message: 'Email inválido.'
            })
        } else {
            const token = generateToken( user );
            user.token = token
            res.cookie( process.env.COOKIE_NAME, user.token ).redirect('/products')
        }
    } catch ( error ) { serverErrorResponse( res, 500 )}
}


/**     LOGOUT     **/
export const userLogout = ( req, res ) => {
    // TODO: Logout de Github
    res.clearCookie(process.env.COOKIE_NAME).redirect('/auth/login')
    console.log('Sesión cerrada')
}