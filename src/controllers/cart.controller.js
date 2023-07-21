import { cartModel, ticketModel } from '../models/models.js'
import { serverErrorResponse } from "../helpers/serverResponses.js";
import { generateCode, calculateAmount } from '../helpers/utils.js';
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen';

import Product from '../dao/products.dao.js';


const productsService = new Product()

/**     CREATE     **/
export const saveToCart = async (req, res) => {
    const id = req.params.id
    try {
        // Busca el producto para ser añadido
        const product = await productsService.getProductByID( id )
        if ( product === 'no-data' ) {
            return serverErrorResponse( res, 404 );
        }

        // Busca el carrito. En caso de no existir, crea una instancia de carrito
        let cart = await cartModel.findOne()
        if (!cart) {
            cart = await cartModel.create({})
        }

        const prevProduct = cart.products.find(item => item.product.equals(product._id))

        if (prevProduct) {
            if (prevProduct.quantity >= product.stock) {
                return res.status(400).json({
                    ok: false,
                    title: 'Error 400',
                    message: 'No hay suficiente stock disponible.'
                })
            }
            prevProduct.quantity += 1;
            prevProduct.totalPrice = product.price * prevProduct.quantity;
        } else {
            if (product.stock <= 0) {
                return res.status(400).json({
                    ok: false,
                    title: 'Error 400',
                    message: 'No hay suficiente stock disponible.'
                })
            }
            cart.products.push({
                product: product._id,
                quantity: 1,
                totalPrice: product.price
            });
        }

        // Calcula la cantidad de productos que hay en el carrito
        const length = cart.products.reduce((total, item) => total + item.quantity, 0)
        cart.length = length

        await cart.save()

        res.status(200).json({
            ok: true,
            status: 200,
            message: 'Producto agregado',
            result: product
        })
    } catch (error) { serverErrorResponse(res, 500) }
}
/**     READ     **/
export const getCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne().populate('products').lean().exec();

        if (!cart) {
            return res.status(200).json({
                ok: false,
                status: 200,
                result: 'no-data'
            })
        }
        res.status(200).json({
            ok: true,
            status: 200,
            cid: cart._id,
            result: cart
        });

    } catch (error) { serverErrorResponse(res, 500) }
}
/**     DELETE     **/
export const cleanCart = async (req, res) => {
    try {

        const cart = await cartModel.findOne();

        if (!cart) {
            return res.status(404).json({
                ok: false,
                title: 'Error 404',
                message: 'Aún hay productos en el carrito.'
            })
        }

        await cartModel.findOneAndDelete({});

        res.status(200).json({
            ok: true,
            title: 'Carrito eliminado',
            message: `Carrito vaciado exitosamente.`
        });

    } catch (error) { serverErrorResponse(res, 500) }
}
/**     DELETE by ID     **/
export const deleteById = async (req, res) => {
    const id = req.params.id;

    try {
        const cart = await cartModel.findOne();

        if (!cart) {
            return res.status(404).json({
                ok: false,
                title: 'Error 404',
                message: 'Aún hay productos en el carrito.'
            })
        }

        const productIndex = cart.products.findIndex(
            item => item.product._id.toString() === id
        );

        if (productIndex === -1) {
            return res.status(404).json({
                ok: false,
                title: 'Error 404',
                message: 'Producto no encontrado en el carrito.'
            })
        }

        cart.products.splice(productIndex, 1);

        // Calcular la longitud de productos actualizada
        const length = cart.products.reduce((total, item) => total + item.quantity, 0);
        cart.length = length;

        await cart.save();

        res.status(200).json({
            ok: true,
            title: 'Producto eliminado',
            message: `Producto eliminado con el ID: ${id}`
        });

    } catch (error) { serverErrorResponse(res, 500) }
}
/**     PURCHASE     **/
export const purchase = async (req, res) => {

    const cartId = req.params.cid
    try {

        const cart = await cartModel.findOne({ _id: cartId }).lean().exec()

        const { email, username } = req;

        // Crear el ticket con los datos de la compra
        const ticket = await ticketModel.create({
            code: generateCode(),
            purchase_datetime: Date.now(),
            amount: calculateAmount( cart.products ),
            purchaser: email,
        });

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
        console.log(error.message);
    }
}