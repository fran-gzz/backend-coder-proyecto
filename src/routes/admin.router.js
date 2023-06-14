import { Router } from "express";
import productModel from "../models/products.model.js";
import userModel from "../models/user.model.js";


const router = Router()

const auth = (req, res, next) => {
    if(req.session.user.role === 'admin') return next()
    return res.redirect('/products')
}

router.get('/', auth, (req, res) => res.redirect('/admin/products'))

//// Productos ////
// Create
router.get('/products/create', auth, (req, res) => {
    res.render('admin/createProduct', { pageTitle: 'Crear un nuevo producto' })
})
router.post('/products', async (req, res) => {
    const product = req.body;
    const newProduct = new productModel( product )
    await newProduct.save();
    res.redirect('/admin/products')
})

// Read
router.get('/products', auth, async(req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('admin/products', {
        pageTitle: 'Panel de control', data: products
    })
})

// Update
router.get('/products/update/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const product = await productModel.findById({_id}).lean().exec();
    res.render('admin/updateProduct', { 
        pageTitle: "Actualizar producto", product
    })
})
router.put('/products/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const productNewData = req.body
    await productModel.findByIdAndUpdate({ _id }, { ...productNewData })
})

// Delete
router.delete('/products/:title', auth, async (req, res) => {
    const title = req.params.title;
    await productModel.deleteOne({ title })
    res.send(`Producto con [${title}] eliminado exitosamente`)
})


//// Usuarios ////
router.get('/users', auth, async ( req, res ) => {
    const users = await userModel.find().lean().exec()
    res.render('admin/users', {
        pageTitle: 'Panel de control',
        isAdmin: isAdmin,
        data: users
    })
})

export default router;