const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/cart.router');


const app = express();
app.use(express.json())

app.get('/', ( req, res ) => {
    res.send('Bienvenido! Debes navegar a /api/products para ver los productos, o a /api/carts para ver los carritos de compras.')
})

app.use('/api/products', productsRouter )

app.use('/api/carts', cartsRouter )

const PORT = '8080'
app.listen( PORT, () => console.log('Server up...'))