import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { faker } from '@faker-js/faker'
import { serverErrorResponse } from './serverResponses.js'


/*      Hasheo de contraseña      */
export const createHash = password => {
    return bcrypt.hashSync( password, bcrypt.genSaltSync(10) )
}
export const isValidPassword = ( user, password ) => {
    return bcrypt.compareSync(password, user.password)
}

/*      Jsonwebtoken      */
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
        req.role = user.role
        req.email = user.email
        req.username = user.first_name
        
    } catch (error) {
        return res.status( 401 ).json({
            ok: false,
            status: 401,
            message: 'Token inválido.'
        })
    }

    next()
}

export const authorization = ( requiredRole ) => ( req, res, next ) => {
    if( req.role === requiredRole ) {
        next()
    } else {
        return serverErrorResponse( res, 403 )
    }
}

export const extractCookie = req => {
    return ( req && req.cookies ) ? req.cookies[ process.env.COOKIE_NAME ] : null
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

export const generateRandomString = (num) => {
    return [...Array(num)].map(() => {
        const randomNum = ~~(Math.random() * 36);
        return randomNum.toString(36);
    })
        .join('')
        .toUpperCase();
}


//////////////////

faker.location = 'es'

// Plantilla de productos mockeados
export const generateMockingProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 1, max: 50 }),
        thumbnail: faker.image.urlLoremFlickr({ category: 'cats' }),
    }
}