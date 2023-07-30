import { ProductService } from '../repositories/index.js'
import { serverErrorResponse } from '../helpers/serverResponses.js';
import { generateMockingProducts } from '../helpers/utils.js';

import CustomError from '../errors/CustomError.js';
import ErrorType from '../errors/error-type.js';
import { typeErrorMessage } from '../errors/error-messages.js';

import logger from '../config/winston.config.js';

/**     CREATE     **/
export const createProduct = async (req, res) => {
    const product = req.body
    try {
        if( !product.title || !product.description || !product.price || !product.thumbnail || !product.stock ) {
            CustomError.createError({
                name: 'Error al crear el producto',
                cause: typeErrorMessage( product, 'product' ),
                code: ErrorType.INVALID_TYPES_ERROR
            })
        }
        let result = await ProductService.create( product )

        logger.info(`Producto creado con el ID: ${ result._id }.`,)

        res.status(201).json({
            ok: true,
            status: 201,
            message: `Producto creado con el ID: ${ result._id }.`,
        })
    } catch ( error ){
        logger.error(error.message);
        logger.error(error.cause);
        serverErrorResponse( res, 500 )
    }
}
/**     READ     **/
export const getProducts = async (req, res) => {
    let page = parseInt(req.query?.page) || 1;
    let limit = 6
    try {
        const result = await ProductService.readAll( page, limit )
        res.status(200).json({
            ok: true,
            status: 200,
            result: result,
        })
    } catch ( error ){ serverErrorResponse( res, 500 )}
}
/**     READ by ID   **/
export const getProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductService.readById( id )
        if ( product === null ) {
            return serverErrorResponse( res, 404 )
        } else {
            res.status( 200 ).json({
                ok: true,
                status: 200,
                result: product
            })
        }
    } catch ( error ){ serverErrorResponse( res, 500 )}
}
/**     UPDATE      **/
export const updateProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductService.readById( id );
        if ( product === null ) {
            return serverErrorResponse( res, 404 )
        } else {

            logger.info(`Producto actualizado con el ID: ${ result._id }.`)

            let result = await ProductService.update( product._id, req.body )
            res.status( 200 ).json({
                ok: true,
                status: 200,
                message: `Producto actualizado con el ID: ${ result._id }.`,
            })
        }
    } catch ( error ){ serverErrorResponse( res, 500 )}
}
/**     DELETE      **/
export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductService.readById( id )
        if ( product === null ) {
            return serverErrorResponse( res, 404 )
        } else { 
            await ProductService.delete( product._id )
            
            logger.info(`Producto eliminado con el ID: ${ id }.`)
            res.status(200).json({
                ok: true,
                status: 200,
                message: `Producto eliminado con el ID: ${ id }.`,
            })
        }
    } catch ( error ){ serverErrorResponse( res, 500 )}
}
/**     MOCK      **/
export const getMockingProducts = async (req, res) => {
    let products = []
    const totalProducts = 100;
    try {
        for( let i = 0; i < totalProducts; i++ ){
            products.push( generateMockingProducts())
        }
        res.status( 200 ).json({
            ok: true,
            status: 200,
            result: products
        })
    } catch ( error ){ serverErrorResponse( res, 500 )}
}