import { Router } from "express";
import productModel from "../models/products.model.js";
import userModel from "../models/user.model.js";
import { createProduct, deleteProduct, updateProduct } from "../controllers/products.controller.js";


const router = Router()




router.get('/', (req, res) => res.redirect('/admin/products'))

/*      Productos       */
// Create
router.get('/products/create', (req, res) => {
    res.render('admin/createProduct', { pageTitle: 'Crear un nuevo producto' })
})

router.post('/products', createProduct )

// Read
router.get('/products', async(req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('admin/products', {
        pageTitle: 'Panel de control', data: products
    })
})

// Update
router.get('/products/update/:id', async (req, res) => {
    const _id = req.params.id;
    const product = await productModel.findById({_id}).lean().exec();
    res.render('admin/updateProduct', { 
        pageTitle: "Actualizar producto", product
    })
})
router.put('/products/:id', updateProduct )

// Delete
router.delete('/products/:id', deleteProduct )


//// Usuarios ////
router.get('/users', async ( req, res ) => {
    const users = await userModel.find().lean().exec()
    res.render('admin/users', {
        pageTitle: 'Panel de control',
        data: users
    })
})

export default router;