import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

/**     CREATE     **/
export const saveToCart = async ( req, res ) => {
    const _id = req.params.id
    try {
        // Busca el producto para ser añadido
        const product = await productModel.findOne({ _id }).lean().exec()
        if( !product ) {
            return res.status( 404 ).json({
                ok: false,
                title: 'Error 404',
                message: `No existe ningún producto con el ID: ${ _id }`
            })
        }

        // Busca el carrito. En caso de no existir, crea una instancia de carrito
        let cart = await cartModel.findOne()
        if( !cart ){
            cart = await cartModel.create({})
        }
    
        const prevProduct = cart.products.find( item  => item.product.equals( product._id ))
        
        if( prevProduct ) {
            if( prevProduct.quantity >= product.stock ) {
                return res.status( 400 ).json({
                    ok: false,
                    title: 'Error 400',
                    message: 'No hay suficiente stock disponible.'
                })
            }
            prevProduct.quantity += 1;
            prevProduct.totalPrice = product.price * prevProduct.quantity;
        } else {
            if( product.stock <= 0 ) {
                return res.status( 400 ).json({
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
        const length = cart.products.reduce(( total, item ) => total + item.quantity, 0)
        cart.length = length

        await cart.save()
        
        res.status( 200 ).json({
            ok: true,
            title: 'Producto agregado al carrito.',
            message: `Se agregó al carrito el producto con el id: ${ _id }`
        })
    } catch( error ){
        res.status( 500 ).json({
            ok: false,
            status: 500,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}
/**     READ     **/
export const getCart = async ( req, res ) => {
    try {
        const cart = await cartModel.findOne().populate('products').lean().exec();

        const docs = cart?.products || []; // Verifica si el carrito está vacío, de ser así se le asigna un array vacío como valor.
        res.status( 200 ).json({ 
            ok: true,
            status: 200,
            data: docs
        });

    } catch( error ){
        
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}
/**     DELETE     **/
export const cleanCart = async ( req, res ) => {
    try {
        
        const cart = await cartModel.findOne();

        if (!cart) {
            return res.status( 404 ).json({
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

    } catch( error ){
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}

/**     DELETE by ID     **/
export const deleteById = async ( req, res ) => {
    const id = req.params.id;

    try {
        const cart = await cartModel.findOne();
  
        if (!cart) {
            return res.status( 404 ).json({
                ok: false,
                title: 'Error 404',
                message: 'Aún hay productos en el carrito.'
            })
        }
  
        const productIndex = cart.products.findIndex(
            item => item.product._id.toString() === id
        );
  
        if (productIndex === -1) {
            return res.status( 404 ).json({
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
            message: `Producto eliminado con el ID: ${ id }`
        });

    } catch( error ){
        console.log( error )
        res.status( 500 ).json({
            ok: false,
            title: 'Error interno del servidor (HTTP 500).',
            message: 'Lamentamos el inconveniente, estamos trabajando para solucionarlo pronto.'
        })
    }
}