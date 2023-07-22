import { Router } from 'express';
import { cleanCart, deleteById, getCart, saveToCart, purchase } from '../controllers/cart.controller.js';
import { validateToken, authorization } from '../helpers/utils.js';


const router = Router();

router.use( validateToken, authorization('user'))
/*      Create      */
router.post('/:id', saveToCart);
/*      Read      */
router.get('/', getCart);
/*      Delete     */
router.delete('/', cleanCart)
router.delete('/:id', deleteById);

/*      Purchase     */
router.post('/:cid/purchase', purchase)
export default router;