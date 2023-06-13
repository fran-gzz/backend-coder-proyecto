import { Router } from 'express';
import productModel from '../models/products.model.js'


const router = Router();

const auth = (req, res, next ) => {
    if(req.session.user) return next()
    return res.redirect('/sessions/login')
}

// Read

router.get('/', auth, async ( req, res ) => {

    let page = parseInt( req.query?.page ) || 1;
    
    const products = await productModel.paginate({}, { page, limit: 6, lean: true})
    const user = req.session.user

    let isAdmin = false;

    if ( user?.role === 'admin' ) isAdmin = true

    products.docs = products.docs.map( product => {
        return {...product, isAdmin}
    })
    
    res.render('products', {
        pageTitle: 'Productos',
        data: products,
        isAdmin: isAdmin,
        username: user.username
    })
})


router.get('/:id', auth, async(req, res) => {
    const product = await productModel.findOne({ _id: req.params.id }).lean().exec()
    
    const user = req.session.user
    const isAdmin = user?.role === 'admin';

    res.render('product', {
        pageTitle: product.title,
        product,
        isAdmin
    })
})

export default router;