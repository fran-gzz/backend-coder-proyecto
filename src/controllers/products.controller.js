/**
    Proximamente el proyecto será divido entre el backend y el frontend.
    Para cuando termine de desarrollar el frontend en ReactJS, el "res.render" será sustituido por un "res.json".
    Mientras tanto, se usará el "res.render", ya que es correspondiente usar esto en un entorno de handlebars
**/

import productModel from '../models/products.model.js';

/**     CREATE     **/
export const createProduct = async ( req, res ) => {
    const product = new productModel(req.body)
    try {
        await product.save()
        console.log(`Se creó el producto con el ID: ${ product._id }.`);
        res.status( 201 ).json({
            ok: true,
            title: 'Producto creado.',
            message: `Se creó el producto con el ID: ${ product._id }.`,
        })
    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}

/**     READ     **/
export const getProducts = async ( req, res ) => {
    let page = parseInt( req.query?.page ) || 1;
    try {
        const products = await productModel.paginate({}, { page, limit: 6, lean: true })
        const user = req.session.user
        res.status( 200 ).render('products', {
            ok: true,
            pageTitle: 'Productos',
            data: products,
            username: user.username
        })   
    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}

/**     READ by ID   **/
export const getProductById = async ( req, res ) => {
    const _id = req.params.id;
    try {
        const product = await productModel.findOne({ _id }).lean().exec()
        if( !product ) {
            return res.status( 404 ).json({
                ok: false,
                title: 'Error 404',
                message: `No existe ningún producto con el ID: ${ _id }`
            })
        }
        res.status( 200 ).render('product', {
            ok: true,
            pageTitle: product.title,
            product
        })
    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}

/**     UPDATE      **/
export const updateProduct = async( req, res ) => {
    const _id = req.params.id;
    try {
        const product = await productModel.findOne({ _id }).lean().exec()
        if( !product ) {
            return res.status( 404 ).json({
                ok: false,
                title: 'Error 404',
                message: `No existe ningún producto con el ID: ${ _id }`
            })
        }
        await productModel.findByIdAndUpdate( _id, req.body )
        console.log(`Se actualizó el producto con el ID: ${ _id }.`)
        res.status( 200 ).json({
            ok: true,
            title: 'Producto actualizado.',
            message: `Se actualizó el producto con el ID: ${ _id }.`,
        })
    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}

/**     DELETE      **/
export const deleteProduct = async( req, res ) => {
    const _id = req.params.id;
    try {
        const product = await productModel.findOne({ _id }).lean().exec()
        if( !product ) {
            return res.status( 404 ).json({
                ok: false,
                title: 'Error 404',
                message: `No existe ningún producto con el ID: ${ _id }`
            })
        }
        await productModel.findByIdAndDelete( _id );
        console.log(`Se eliminó el producto con el ID: ${ _id }.`)
        res.status( 200 ).json({
            ok: true,
            title: 'Producto eliminado.',
            message: `Se eliminó el producto con el ID: ${ _id }.`,
        })
    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}