import { Router } from 'express';
import productModel from '../models/products.model.js'


const router = Router();

const auth = (req, res, next ) => {
    if(req.session.user) return next()
    return res.redirect('/sessions/login')
}


// Create
router.get('/create', auth, (req, res) => {

    const user = req.session.user
    let isAdmin = false;
    if ( user?.role === 'admin' ) {
        isAdmin = true
    }

    res.render('create', {
        pageTitle: 'Crear un nuevo producto',
        isLoggedIn: true,
        isAdmin: isAdmin
    })
})
router.post('/', async (req, res) => {
    const product = req.body;
    const newProduct = new productModel( product )
    await newProduct.save();
    res.redirect('/products')
})

// Update
router.get('/update/:id', async (req, res) => {
    const _id = req.params.id;
    const product = await productModel.findById({_id}).lean().exec();
    const user = req.session.user
    let isAdmin = false;
    if ( user?.role === 'admin' ) {
        isAdmin = true
    }
    res.render('update', { 
        pageTitle: "Actualizar producto",
        product,
        isLoggedIn: true,
        isAdmin: isAdmin
    })
})
router.put('/:id', async (req, res) => {
    const _id = req.params.id;
    const productNewData = req.body
    await productModel.findByIdAndUpdate({ _id }, { ...productNewData })
})


// Read


router.get('/', auth, async ( req, res ) => {

    let page = parseInt( req.query.page ) || 1;
    
    const products = await productModel.paginate({}, { page, limit: 6, lean: true})
    const user = req.session.user

    let isAdmin = false;

    if ( user?.role === 'admin' ) {
        isAdmin = true
    }

    products.docs = products.docs.map( product => {
        return {...product, isAdmin}
    })
    

    res.render('products', {
        pageTitle: 'Productos',
        docs: products.docs,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/products?page=${ products.prevPage }` : '',
        nextLink: products.hasNextPage ? `/products?page=${ products.nextPage }` : '',
        isLoggedIn: true,
        isAdmin: isAdmin,
        username: user.username
    })
})


router.get('/:title', auth, async(req, res) => {
    
    const title = req.params.title
    const product = await productModel.findOne({title}).lean().exec()
    
    const user = req.session.user
    const isAdmin = user?.role === 'admin';

    res.render('product', {
        pageTitle: title,
        product,
        isLoggedIn: true,
        isAdmin
    })
})



// Delete
router.delete('/:title', async (req, res) => {
    const title = req.params.title
    await productModel.deleteOne({ title })
    res.send(`Producto con el ID [${title}] eliminado exitosamente`)
})

export default router;