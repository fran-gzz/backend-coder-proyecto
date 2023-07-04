import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/products.controller.js';

import { passportCall, authorization } from '../helpers/utils.js';

const router = Router();


router.get( '/', getProducts )
router.get( '/:id', getProductById )

export default router;