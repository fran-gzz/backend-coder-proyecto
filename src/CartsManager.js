const fs = require('fs');

const ProductsManager = require('./ProductsManager');
const manager = new ProductsManager();


class CartsManager {

    #carts = [];

    constructor () {
        this.path = './data/carts.json';
        if ( fs.existsSync( this.path )) {
            const content = fs.readFileSync( this.path, 'utf-8' )
            this.#carts = JSON.parse( content )
        }
    }

    #generateID = () => {
        let id;
        if( this.#carts.length === 0 ) id = 1;
        else id = this.#carts[ this.#carts.length - 1 ].id + 1
        return id;
    }

    getCarts = () => {        
        if ( this.#carts.length > 0 ) {
            return this.#carts
        }
    }
    
    getCartByID = ( id ) => {
        const cart = this.#carts.find( cart => cart.id === id );
        if ( !cart ) {
            console.error(`No se encontró ningún carrito con el ID: ${ id }`)
            return null;
        }
        return cart;
    }

    createCart = () => {
        const products = [];
        let id = this.#generateID()
        this.#carts.push({ id, products });
        fs.writeFileSync(this.path, JSON.stringify( this.#carts, null, '\t' ))
    }

    addToCart = ( productID, cartID ) => {

        const productByID = manager.getProductById( productID )
        const { code, id } = productByID;

        const cart = this.#carts[ cartID - 1]
        if( !cart.products ) {
            cart.products = []
        }
        const products = cart.products;
        
        const index = products.findIndex( product => product.id === id && product.code === code )

        if ( index !== -1 ) {
            products[ index ].quantity++;
        } else {
            products.push({ id, code, quantity: 1 })
        }
        
        fs.writeFileSync(this.path, JSON.stringify( this.#carts, null, '\t' ))
    }
}

module.exports = CartsManager;