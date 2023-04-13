const fs = require('fs');

class ProductsManager {

    #products = [];

    constructor() {
        this.path = './data/products.json';
        if( fs.existsSync( this.path )) {
            const content = fs.readFileSync( this.path, 'utf-8' );
            this.#products = JSON.parse( content )
        }
    }

    #generateID = () => {
        let id;
        if ( this.#products.length === 0 ) id = 1;
        else id = this.#products[ this.#products.length - 1 ].id + 1
        return id;
    }

    getProducts = () => {        
        if ( this.#products.length > 0 ) {
            return this.#products
        } else {
            throw new Error ('No se encontraron productos.')
        }
    }

    getProductById = ( id ) => {
        const product = this.#products.find( product => product.id === id );
        if ( !product ) {
            console.error(`No se encontró ningún producto con el ID ${ id }`);
            return null;
        }
        return product;
    }

    addProduct = ( product ) => {     
    
        const requiredFields = ['title', 'description', 'price', 'code', 'stock' ];

        for ( const field of requiredFields ) {
            if ( !product[ field ] ) {
                console.error(`Debes completar el campo ${ field }.`)
                return false;
            }
        }

        const { code } = product;

        if ( this.#products.some( product => product.code === code )) {
            console.error(`Ya existe un producto con el código ${ code }.`);
        }

        let id = this.#generateID()
        this.#products.push({ id, ...product });

        fs.writeFileSync(this.path, JSON.stringify( this.#products, null, '\t' ))

        console.log('Producto agregado. 👌')
    }

    updateProduct = ( id, updates ) => {
        const productID = this.#products.findIndex( product => product.id === id )
        if( productID === -1 ) {
            console.error(`No existe ningún producto con el ID: '${ id }'`);
            return;
        }
        const updatedProduct = {
            ...this.#products[ productID ],
            ...updates,
            id,
        }
        this.#products[ productID ] = updatedProduct;
        fs.writeFileSync(this.path, JSON.stringify( this.#products, null, '\t' ))
        console.log(`Se actualizó el producto con el id ${ id }.`);
    }

    deleteProduct = ( id ) => {
        const productID = this.#products.findIndex( product => product.id === id )
        if( productID !== -1 ) {
            this.#products.splice( productID, 1 );
            fs.writeFileSync(this.path, JSON.stringify(this.#products, null, '\t'));
            console.log(`Producto con el ID ${id} eliminado.`);
        } else {
            console.log(`No existe ningún producto con el ID: ${ id }`)
        }
    }
}

module.exports = ProductsManager;