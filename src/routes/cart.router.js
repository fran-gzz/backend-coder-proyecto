import { Router } from 'express';
import cartModel from '../models/carts.model.js';
import productModel from '../models/products.model.js';


const router = Router();

router.get('/', async (req, res) => {
    const cart = await cartModel.findOne().populate('products');
    const products = cart.products
    console.log(products)
    res.render('cart', { 
        pageTitle: 'Carrito',
        products
    });
    
});



router.post('/add/:productId', async ( req, res ) => {
    try {
        const productId =  req.params.productId
        const product = await productModel.findById( productId )

        if( !product ) {
            return res.status(404).send('Producto no encontrado')
        }

        let cart = await cartModel.findOne()
        if (!cart ) {
            cart = await cartModel.create({})
        }

        cart.products.push(product._id)
        await cart.save()

        res.send({ message: 'Producto agregado al carrito' })

    } catch ( error ){
        res.status(404).send({ error: 'Error interno del servidor' })
    }
})



export default router;