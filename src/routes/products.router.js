import { Router } from 'express';
import productModel from '../models/products.model.js'


const router = Router();

const auth = (req, res, next ) => {
    if(req.session.user) return next()
    return res.redirect('/sessions/login')
}

router.get('/', auth, async ( req, res ) => {

    let page = parseInt( req.query?.page ) || 1;
    
    const products = await productModel.paginate({}, { page, limit: 6, lean: true})

    const user = req.session.user

    res.render('products', {
        pageTitle: 'Productos',
        data: products,
        username: user.username
    })
})

router.get('/:id', auth, async(req, res) => {
    const product = await productModel.findOne({ _id: req.params.id }).lean().exec()
    res.render('product', {
        pageTitle: product.title, product
    })
})

export default router;