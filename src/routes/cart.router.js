const { Router } = require('express');
const CartsManager = require('../CartsManager');

const router = Router();
const manager = new CartsManager();

/**
 para la ruta carts, se debe configurar:
  * la ruta POST '/' que debe crear un nuevo carrito con la siguiente estructura:
    - ID irrepetible
    - products []
    ✅
  * la ruta GET '/:id' que debe listar los productos que pertenezcan al carrito provisto por el paramatro id
    ✅
  * la ruta POST '/:id/product/:id' que debe AGREGAR el producto al arreglo products con el siguiente formato:
    - ID del producto
    - quantity: n° de ejemplares del producto. Por ahora, se agregará de uno en uno. Si existe el producto, debe sumarse la cantidad en lugar de crear uno nuevo.
  * debe usarse file system para persistencia de datos.
 */

/*------  Método GET ------*/
// Todos los carritos
router.get('/', ( req, res ) => {
    const data =  manager.getCarts();
    if ( !data ) {
        res.status( 204 ).send({ message: 'No hay carritos' })
    } else {
        res.status( 200 ).send({ data })
    }
})

router.get('/:id', ( req, res ) => {
    try {
        const ID = +req.params.id;
        const cart = manager.getCartByID( ID );
        res.status( 200 ).send({ cart })
    } catch ( error ) {
        res.status( 404 ).send({ error: error.message })
    }
})

/*------  Método POST ------*/
// Crea un carrito
router.post('/', ( req, res ) => {
    manager.createCart();
    res.status( 201 ).send('Carrito creado. 👌')
})

// Agregar producto al carrito
router.post('/:cid/product/:pid', ( req, res ) => {
    const cartID = +req.params.cid;
    const productID = +req.params.pid;
    manager.addToCart(productID, cartID)
    res.status( 201 ).send('Producto añadido al carrito')
})

module.exports = router;