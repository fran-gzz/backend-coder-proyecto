import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getMockingProducts } from '../controllers/products.controller.js';
import { validateToken, authorization } from '../helpers/utils.js';

const router = Router();

router.get('/', getProducts)
router.get('/mockingproducts', getMockingProducts)
router.get('/:id', getProductById)


router.use(validateToken, authorization('admin'))

/*      Rutas protegidas      */
router.post('/', createProduct )
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router;