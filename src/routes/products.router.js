import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js';
import { validateToken, authorization } from '../helpers/utils.js';

const router = Router();

router.get( '/', getProducts )
router.get( '/:id', getProductById )

/*      Protección de ruta      */
router.use( validateToken, authorization('admin'))
router.post('/', createProduct )
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router;