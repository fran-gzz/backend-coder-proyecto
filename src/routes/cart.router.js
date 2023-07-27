import { Router } from 'express';
import { cleanCart, getCart, purchase, createCart, addToCart, deleteFromCart, updateCart, updateProductFromCart } from '../controllers/cart.controller.js';
import { validateToken, authorization } from '../helpers/utils.js';


const router = Router();

// Authorization
router.use( validateToken, authorization('user'))

router.post('/', createCart); // Create cart
router.get('/:cid', getCart); // Get cart by ID
router.post('/:cid/product/:pid', addToCart) // Add product to cart
router.delete('/:cid/product/:pid', deleteFromCart) // Delete product from cart
router.put('/:cid', updateCart) // Update cart
router.put('/:cid/product/:pid', updateProductFromCart) // Update product IN cart
router.delete('/:cid', cleanCart) // Delete ALL products from cart
router.post('/:cid/purchase', purchase) // Purchase cart


export default router;