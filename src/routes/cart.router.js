import { Router } from 'express';
import { cleanCart, deleteById, getCart, saveToCart } from '../controllers/cart.controller.js';


const router = Router();

/*      Create      */
router.post('/add/:id', saveToCart);

/*      Read      */
router.get('/', getCart);

/*      Delete     */
router.delete('/delete/', cleanCart)
router.delete('/delete/:id', deleteById);


export default router;