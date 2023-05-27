import { Router } from 'express';
import cartModel from '../models/carts.model.js';
import productModel from '../models/products.model.js';


const router = Router();

const auth = (req, res, next ) => {
    if(req.session.user) return next()
    return res.redirect('/sessions/login')
}
// Read
router.get('/', auth, async (req, res) => {
    try {
        const cart = await cartModel.findOne().populate('products').lean().exec();
        const docs = cart?.products || []; // Verifica si el carrito está vacío, de ser así se le asigna un array vacío como valor.
        const user = req.session.user;
        const isAdmin = user?.role === 'admin';
        res.render('cart', { 
            pageTitle: 'Carrito',
            docs,
            isLoggedIn: true,
            isAdmin
        });
    } catch ( error ) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});



// Delete
router.delete('/delete/', async (req, res) => {
    try {
        const cart = await cartModel.findOneAndDelete({});
        res.send({ message: 'Carrito vaciado correctamente.' })
    } catch( error ){
        res.status(500).send({ error: 'Error al vaciar el carrito.' })
    }
})

// Delete by ID
router.delete('/delete/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
      const cart = await cartModel.findOne();
  
      if (!cart) {
        return res.status(404).send('Carrito no encontrado');
      }
  
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );
  
      if (productIndex === -1) {
        return res.status(404).send('Producto no encontrado en el carrito');
      }
  
      cart.products.splice(productIndex, 1);
      await cart.save();
  
      console.log('Producto eliminado del carrito correctamente');
      res.send({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
      console.log('Error al eliminar el producto del carrito');
      res.status(500).send({ error: 'Error al eliminar el producto del carrito' });
    }
  });


  // Create
router.post('/add/:id', async ( req, res ) => {
    try {
        const id =  req.params.id
        const product = await productModel.findById( id )

        if( !product ) {
            return res.status(404).send('Producto no encontrado')
        }

        let cart = await cartModel.findOne()
        if (!cart ) {
            cart = await cartModel.create({})
        }

        const existingProduct = cart.products.find(( item ) => item.product.equals( product._id ))
        
        if( existingProduct ) {
            if(existingProduct.quantity >= product.stock ) {
                return res.status( 400 ).send('No hay suficiente stock disponible.')
            }
            existingProduct.quantity += 1;
            existingProduct.totalPrice = product.price * existingProduct.quantity;
            console.log('Producto agregado.');
            res.status(200).send({message: 'Producto agregado'})
        } else {
            if( product.stock <= 0 ) {
                return res.status(400).send('No hay stock disponible.')
            }
            cart.products.push({
                product: product._id,
                quantity: 1,
                totalPrice: product.price
            });
            console.log('Producto agregado.');
            res.status(200).send({message: 'Producto agregado'})
        }

        await cart.save()

    } catch ( error ){
        res.status(404).send({ error: 'Error interno del servidor' })
    }
})
  
export default router;