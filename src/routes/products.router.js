import { Router } from 'express';
import productModel from '../models/products.model.js'


const router = Router();

// Create
router.get('/create', (req, res) => {
    res.render('create', {
        pageTitle: 'Crear un nuevo producto'
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
    res.render('update', { 
        pageTitle: "Actualizar producto",
        product
    })
})
router.put('/:id', async (req, res) => {
    const _id = req.params.id;
    const productNewData = req.body
    await productModel.findByIdAndUpdate({ _id }, { ...productNewData })
})



// Read
router.get('/', async ( req, res ) => {
    let page = parseInt( req.query.page )
    if( !page ) page = 1

    const products = await productModel.paginate({}, { page, limit: 6, lean: true})

    products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}` : '';
    res.render('products', products )
})
router.get('/:title', async(req, res) => {
    const product = await productModel.findOne(req.res.title).lean().exec()
    res.render('product', {
        pageTitle: 'Producto',
        product
    })
})



// Delete
router.delete('/:title', async (req, res) => {
    const title = req.params.title
    await productModel.deleteOne({ title })
    res.send(`Producto con el ID [${title}] eliminado exitosamente`)
})

export default router;