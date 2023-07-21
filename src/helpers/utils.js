import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'

export const createHash = password => {
    return bcrypt.hashSync( password, bcrypt.genSaltSync(10) )
}

export const isValidPassword = ( user, password ) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    return new Promise(( resolve, reject ) => {
        const payload = { user };
        jwt.sign( payload, process.env.JWT_PRIVATE_KEY, {
            expiresIn: '2h'
        }, ( err, token ) => {
            if( err ) {
                console.log( err );
                reject('No se pudo generar el token.')
            }
            resolve( token );
        })
    }) 
}

export const validateToken = ( req, res, next ) => {

    const token = req.header('x-token')

    if( !token ){
        return res.status( 401 ).json({
            ok: false,
            message: 'No hay token en la petición...'
        })
    }
    try {
        const { user } = jwt.verify(
            token,
            process.env.JWT_PRIVATE_KEY
        )        
        req.email = user.email
        req.username = user.first_name
        
    } catch (error) {
        return res.status( 401 ).json({
            ok: false,
            status: 201,
            message: 'Token inválido.'
        })
    }

    next()
}


export const extractCookie = req => {
    return ( req && req.cookies ) ? req.cookies[ process.env.COOKIE_NAME ] : null
}

export const authToken = ( req, res, next ) => {
    let token = req.headers.authorization
    if( !token ) token = req.cookies[ process.env.COOKIE_NAME ]
    if( !token ) return res.status( 401 ).json({ ok: false, title: 'Not Authorized' })
    jwt.verify( token, process.env.JWT_PRIVATE_KEY, ( error, credentials ) => {
        if( error ) return res.status( 403 ).json({ ok: false, title: 'Forbidden' })
        req.user = credentials.user
        next()
    })
}

export const passportCall = strategy => {
    return async ( req, res, next ) => {
        passport.authenticate( strategy, function( err, user ) {
            if ( err ) return next( err )
            if (!user) return res.status( 401 ).json({
                ok: false,
                title: 'Unauthorized',
                message: 'El usuario no tiene los permisos para acceder.'
            })

            const { first_name, email, role, _id } = user.user;
            req.user = {
                uid: _id,
                username: first_name,
                email: email,
                role: role,
            }
            next()
        })( req, res, next )
    }
}


export const authorization = role => {
    return async ( req, res, next ) => {

        if( !req.user ) return res.status( 401 ).json({ error: 'Unauthorized' })
        if( req.user.role != role ) return res.status( 403 ).json({error: 'No permission'})

        // TODO: permitir el acceso público

        res.locals.loggedIn = req.user ? true : false;
        res.locals.isAdmin = req.user.role === 'admin' ? true : false;

        next()
    }
}

// Función para generar un código único de ticket
export const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = ''
    for( let i = 0; i < 6; i++ ){
        const random = Math.floor( Math.random() * chars.length )
        code += chars[ random ]
    }
    return code;
}

// Función para calcular el valor total de la compra
export const calculateAmount = ( products ) => {
    let amount = 0;
    for (const product of products ) {
        amount += product.totalPrice;
    }
    return amount
}
