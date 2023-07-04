/**
    Proximamente el proyecto será divido entre el backend y el frontend.
    Para cuando termine de desarrollar el frontend en ReactJS, el "res.render" será sustituido por un "res.json".
    Mientras tanto, se usará el "res.render", ya que es correspondiente usar esto en un entorno de handlebars
**/

import Product from '../dao/products.dao.js';
import { serverErrorResponse } from '../helpers/serverResponses.js';

const productsService = new Product()


/**     CREATE     **/
export const createProduct = async (req, res) => {
    const product = req.body
    try {
        let result = await productsService.createProduct( product )
        res.status(201).json({
            ok: true,
            title: 'Producto creado.',
            message: `Se creó el producto con el ID: ${result._id}.`,
        })
    } catch ( error ){ serverErrorResponse( res, 500 )}
}

/**     READ     **/
export const getProducts = async (req, res) => {
    let page = parseInt(req.query?.page) || 1;
    let limit = 6;
    try {
        const products = await productsService.getProducts( page, limit );
        res.status(200).render('products', {
            ok: true,
            pageTitle: 'Productos',
            data: products,
        })
    } catch ( error ){ serverErrorResponse( res, 500 )}
}

/**     READ by ID   **/
export const getProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await productsService.getProductByID( id )
        if ( product === 'no-data' ) {
            return serverErrorResponse( res, 404 )
        } else {
            res.status(200).render('product', {
                ok: true,
                pageTitle: product.title,
                product
            })
        }
    } catch ( error ){ serverErrorResponse( res, 500 )}
}

/**     UPDATE      **/
export const updateProduct = async (req, res) => {
    const _id = req.params.id;
    try {
        const product = await productsService.getProductByID( _id );
        if ( product === 'no-data' ) {
            return serverErrorResponse( res, 404 )
        } else {
            let result = await productsService.updateProduct( product._id, req.body )
            res.status( 200 ).json({
                ok: true,
                status: 200,
                title: 'Producto actualizado.',
                message: `Se actualizó el producto con el ID: ${ result._id }.`,
            })
        }
    } catch ( error ){ serverErrorResponse( res, 500 )}
}

/**     DELETE      **/
export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await productsService.getProductByID( id )
        if ( product === 'no-data' ) {
            return serverErrorResponse( res, 404 )
        } else { 
            let result = await productsService.deleteProduct( product._id )
            res.status(200).json({
                ok: true,
                title: 'Producto eliminado.',
                message: `Se eliminó el producto con el ID: ${result.id}.`,
            })
        }
    } catch ( error ){ serverErrorResponse( res, 500 )}
}