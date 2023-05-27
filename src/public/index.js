const socket = io();

// ADD PRODUCT
const addProductForm = document.querySelector('#addProductForm');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const priceInput = document.querySelector('#price');
const codeInput = document.querySelector('#code');
const stockInput = document.querySelector('#stock');
const thumbnailInput = document.querySelector('#thumbnail');

addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newProduct = {
        title: titleInput.value,
        description: descriptionInput.value,
        thumbnail: thumbnailInput.value,
        code:  codeInput.value,
        price: Math.floor(priceInput.value),
        stock: Math.floor(stockInput.value) 
    };
    socket.emit('newProduct', newProduct);
    addProductForm.reset();
});

// DELETE PRODUCT
const deleteProductForm = document.querySelector('#deleteProductForm');
const deleteId = document.querySelector('#deleteId');

deleteProductForm.addEventListener('submit', ( event ) => {
    event.preventDefault();
    const id = Math.floor(deleteId.value);
    socket.emit('deleteProduct', id);
    deleteProductForm.reset()
})




// GET PRODUCTS
socket.on( 'getAllProducts', ( products )  => {
    const container = document.getElementById('products-container')
    let product = ''
    products.forEach( item => {
        product += `<article class="product">
                        <img
                            src=${ item.thumbnail } 
                            alt=${ item.title }
                        >
                        <h3 >${ item.title }</h3>
                        <p >$${ item.price }</p>
                        <span>ID: ${ item.id }</span>
                    </article>`;
        container.innerHTML = product;
    })
})

socket.on('connect', () => console.log('Conectado al servidor de WebSocket'));
socket.on('disconnect', () => console.log('Desconectado del servidor de WebSocket'));