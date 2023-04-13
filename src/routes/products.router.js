const { Router } = require('express')
const ProductsManager = require('../ProductsManager')


const router = Router();
const manager = new ProductsManager();


/*------  Método GET ------*/
// Todos los productos
router.get('/', ( req, res ) => {
    try {
        const limit = req.query.limit;
        const data = manager.getProducts();
        ( limit )
            ? res.status( 200 ).send({ data: data.slice( 0, limit )})
            : res.status( 200 ).send({ data })
    } catch (error) {
        res.status( 500 ).send({ error: error.message });
    }
})

// Productos por ID
router.get('/:id', ( req, res ) => {
    try {
        const ID = +req.params.id;
        const product = manager.getProductById( ID )
        res.status( 200 ).send({ product })
    } catch ( error ) {
        res.status( 404 ).send({ error: error.message })
    }
})

/*------  Método POST ------*/
// Añadir producto
router.post('/', ( req, res ) => {
    const newProduct = { 
        title:  req.body.title,
        description: req.body.description,
        price: +req.body.price,
        code: req.body.code,
        stock: +req.body.stock
    }
    manager.addProduct( newProduct )
    res.status( 201 ).send({ message: 'Producto agregado' })
})

/*------  Método PUT ------*/
// Editar producto
router.put('/:id', ( req, res ) => {
    const ID = +req.params.id;
    const updates = req.body
    manager.updateProduct( ID, updates )
    res.status( 202 ).send({ message: `Producto con el ID: ${ ID } actualizado.` })
})

/*------  Método DELETE ------*/
// Eliminar producto
router.delete('/:id', ( req, res ) => {
    const id = +req.params.id;
    manager.deleteProduct( id );
    res.status( 202 ).send({ message: `Producto con el ID: ${id} ha sido eliminado.` })
})

module.exports = router;