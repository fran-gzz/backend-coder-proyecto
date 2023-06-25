import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/products.controller.js';

const router = Router();

router.use(( req, res, next ) => req.session.user 
    ? next()
    : res.redirect('/sessions/login')
)
router.get( '/', getProducts )
router.get( '/:id', getProductById )

export default router;