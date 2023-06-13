import { Router } from "express";
import productModel from "../models/products.model.js";


const router = Router()

const auth = (req, res, next ) => {
    if(req.session.user) return next()
    return res.redirect('/sessions/login')
}

//// Productos ////
// Create
router.get('/products/create', auth, (req, res) => {
    const user = req.session.user
    let isAdmin = false;
    if ( user?.role === 'admin' ) {
        isAdmin = true
    }
    res.render('admin/createProduct', {
        pageTitle: 'Crear un nuevo producto',
        isAdmin: isAdmin
    })
})
router.post('/products', async (req, res) => {
    const product = req.body;
    const newProduct = new productModel( product )
    await newProduct.save();
    res.redirect('/admin/products')
})

// Read
router.get('/products', async(req, res) => {
    const products = await productModel.find().lean().exec()
    const user = req.session.user
    let isAdmin = false;
    if ( user?.role === 'admin' ) {
        isAdmin = true
    }
    res.render('admin/products', {
        pageTitle: 'Panel de control',
        isAdmin: isAdmin,
        data: products
    })
})

// Update
router.get('/products/update/:id', async (req, res) => {
    const _id = req.params.id;
    const product = await productModel.findById({_id}).lean().exec();
    const user = req.session.user
    let isAdmin = false;
    if ( user?.role === 'admin' ) {
        isAdmin = true
    }
    res.render('admin/updateProduct', { 
        pageTitle: "Actualizar producto",
        product,
        isAdmin: isAdmin
    })
})
router.put('/products/:id', async (req, res) => {
    const _id = req.params.id;
    const productNewData = req.body
    await productModel.findByIdAndUpdate({ _id }, { ...productNewData })
})

// Delete
router.delete('/products/:title', async (req, res) => {
    const title = req.params.title;
    await productModel.deleteOne({ title })
    res.send(`Producto con [${title}] eliminado exitosamente`)
})


export default router;