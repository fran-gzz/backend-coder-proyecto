import { Router } from 'express';
import { cleanCart, deleteById, getCart, saveToCart, purchase } from '../controllers/cart.controller.js';
import { validateToken } from '../helpers/utils.js';


const router = Router();

/*      Create      */
router.post('/:id', saveToCart);

/*      Read      */
router.get('/', getCart);

/*      Delete     */
router.delete('/', cleanCart)
router.delete('/:id', deleteById);

/*      Purchase     */
router.post('/:cid/purchase', validateToken, purchase)
export default router;