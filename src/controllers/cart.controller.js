import { CartService, ProductService, TicketService } from '../repositories/index.js'
import { serverErrorResponse } from "../helpers/serverResponses.js";
import { generateCode, calculateAmount } from '../helpers/utils.js';
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen';


/**     CREATE     **/
export const createCart = async ( req, res ) => {
    try {
        const result = await CartService.create()
        res.status( 201 ).json({
            status: 201,
            result: result
        })
    } catch ( error ) { serverErrorResponse(res, 500) }
}

/**     GetCart     **/
export const getCart = async ( req, res ) => {

    const cid = req.params.cid

    try {
        const result = await CartService.readOne( cid )
        if( result === null ){
            return serverErrorResponse( res, 404 )
        }

        res.status( 201 ).json({
            status: 201,
            result: result
        })
    } catch ( error ) { 
        serverErrorResponse(res, 500) 
        console.log(error.message)
    }
}

/**     Add to cart     **/
export const addToCart = async ( req, res ) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        const cartToUpdate = await CartService.readOne( cid )
        if( cartToUpdate === null ) {
            return serverErrorResponse( res, 404 )
        }

        const productToAdd = await ProductService.readById( pid )
        if( productToAdd === null ) {
            return serverErrorResponse( res, 404 )
        }

        const prevProduct = cartToUpdate.products.find( item => item.product.equals( pid ))
        if ( prevProduct ) {
            if (prevProduct.quantity >= productToAdd.stock) {
                console.log('no hay stock')
                return res.status(400).json({
                    ok: false,
                    title: 'Error 400',
                    message: 'No hay suficiente stock disponible.'
                })
            }
            prevProduct.quantity += 1
            prevProduct.totalPrice = productToAdd.price * prevProduct.quantity;
        } else {
            if ( productToAdd.stock <= 0) {
                console.log('no hay stock')
                return res.status(400).json({
                    ok: false,
                    title: 'Error 400',
                    message: 'No hay suficiente stock disponible.'
                })
            }
            cartToUpdate.products.push({
                product: pid ,
                quantity: 1,
                totalPrice: productToAdd.price
            })
        }

        const result = await CartService.update( cid, cartToUpdate )
        
        res.status( 200 ).json({
            status: 200,
            result: result
        })

    } catch ( error ) { serverErrorResponse( res, 500 ) }
}

/**     Delete from Cart    **/
export const deleteFromCart = async ( req, res ) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {

        const cartToUpdate = await CartService.readOne( cid )
        if( cartToUpdate === null ) return serverErrorResponse( res, 404 )
        
        const productToDelete = await ProductService.readById( pid )
        if( productToDelete === null ) return serverErrorResponse( res, 404 )
        
        const productIndex = cartToUpdate.products.findIndex( item => item.product._id.toString() == pid )
        if ( productIndex === -1 ){
            return res.status(400).json({ status:'error', error: `Product with id-${ pid } not found in Cart with id-${ cid }`})
        } else {
            cartToUpdate.products = cartToUpdate.products.filter( item => item.product._id.toString() !== pid )
        }
        
        const result = await CartService.update( cid, cartToUpdate )

        res.status(200).json({ 
            status: 200,
            result: result
        })

    } catch ( error ) { 
        serverErrorResponse( res, 500 ) 
        console.log(error.message)
    }
}

/*      Update cart     */
export const updateCart = async ( req, res ) => {
    const cid = req.params.cid
    try {
        const cartToUpdate = await CartService.readOne( cid )
        if( cartToUpdate === null ){
            return res.status(404).json({ status:'error', error: `Cart with id-${ cid } not found`})
        }
        const products = req.body.products
        if(!products) {
            return res.status(400).json({ status: 'error', error: 'Field "products" is not optional' })
        }
        for (let i = 0; i < products.length; i++) {
            if( !products[i].hasOwnProperty( 'product' ) || !products[i].hasOwnProperty( 'quantity' )) {
                return res.status(400).json({ status: 'error', error: 'product must have a valid id and a valid quantity'})
            }
            if( typeof products[i].quantity !== 'number' ){
                return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number'})
            }
            if( products[i].quantity === 0 ) {
                return res.status(400).json({status: 'error', error: 'product\'s quantity cannot be 0'})
            }
            const productToAdd = await ProductService.readById( products[i].product )
            if(productToAdd === null ){
                return res.status(404).json({ status: 'error', error: `Product with id-${products[i].product} doesnot exists` })
            }
        }
        cartToUpdate.products = products
        const result = await CartService.update( cid, cartToUpdate )
        res.status(200).json({ 
            status: 200,
            result: result
        })
    } catch ( error ) { serverErrorResponse( res, 500 ) }
}

/*      Update product from cart     */
export const updateProductFromCart = async ( req, res ) => {
    const cid = req.params.cid
    const pid = req.params.pid

    try {
        const cartToUpdate = await CartService.readOne( cid )
        if( cartToUpdate === null ){
            return res.status(404).json({ status:'error', error: `Cart with id-${ cid } not found`})
        }
        const productToUpdate = await ProductService.readById( pid )
        if( productToUpdate === null ) {
            return res.status(404).json({ status: 'error', error: `Product with id-${pid} Not found` })
        }
        
        const quantity = req.body.quantity
        if( !quantity ) {
            return res.status(400).json({ status: 'error', error: 'Field "quantity" is not optional' })
        }

        if( typeof quantity !== 'number') {
            return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number'})
        }

        if( quantity === 0 ) {
            return res.status(400).json({status: 'error', error: 'product\'s quantity cannot be 0'})
        }
        const productIndex = cartToUpdate.products.findIndex( item => item.product == pid )
        if( productIndex === -1 ){
            return res.status(400).json({ status: 'error', error: `Product with id-${pid} Not found in Cart with id-${cid}`})
        } else {
            cartToUpdate.products[productIndex].quantity = quantity
        }

        const result = await CartService.update( cid, cartToUpdate )
        res.status(200).json({ 
            status: 200,
            result: result
        })
    } catch ( error ) { serverErrorResponse( res, 500 ) }
}

/*      Clean cart     */
export const cleanCart = async ( req, res ) => {
    const cid = req.params.cid
    try {
        const cartToUpdate = await CartService.readOne( cid )
        if( cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id-${cid} Not found`})
        }
        cartToUpdate.products = []
        const result = await CartService.update( cid, cartToUpdate )
        res.status(200).json({ status: 'sucess', payload: result })
    } catch ( error ) { serverErrorResponse( res, 500 )}
}

/**     PURCHASE     **/
export const purchase = async (req, res) => {
    const cid = req.params.cid
    try {

        const cart = await CartService.readOne( cid )
        if( cart === null ) return res.status(404).json({ status:'error', error: `Cart with id-${ cid } not found`})
    
        const { email, username } = req;

        const newTicket = {
            code: generateCode(),
            purchase_datetime: Date.now(),
            amount: calculateAmount( cart.products ),
            purchaser: email
        }

        // Crear el ticket con los datos de la compra
        const ticket = await TicketService.create( newTicket )
        
        const newArray = cart?.products.map( item => {
            return {
                producto: item.product.title,
                cantidad: item.quantity,
                precio: `ARS $${item.totalPrice}`
            }
        })
        
        // Configuración de nodemailer para que funcione con Gmail
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        }
        
        let transporter = nodemailer.createTransport( config );
        let MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Store',
                link: 'http://localhost:5173/' // Reemplazar por el dominio en el futuro
            }
        })
        
        let response = {
            body: {
                greeting: 'Hola',
                name: username,
                intro: [
                    'Tu factura ha llegado!',
                    `Tu compra efectuada el día ${ ticket.purchase_datetime } ha sido realizada con éxito`,
                ],
                table: { data: newArray },
                outro: [
                    `El total de la compra es de: ARS $${ ticket.amount }`,
                    `El código de tu compra es: ${ ticket.code }`,
                    'Gracias por confiar en nosotros.'
                ],
                signature: false
            }
        }        
        
        let mail = MailGenerator.generate( response )
        
        let message = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Compra realizada.',
            html: mail
        }

        await transporter.sendMail( message )

        return res.status(200).json({
            ok: true,
            status: 200,
            message: 'Compra realizada',
            ticket,
        });

    } catch (error) { 
        serverErrorResponse(res, 500)
        console.log(error.message)
    }
}