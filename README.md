# backend-coder-proyecto

Hola 👋, muy buenas. Este el proyecto final para el curso de backend en coderhouse.
Se trata del backend para un **ecommerce**. La vista frontend aún no está disponible 😔.

## Instalación ⏬

En tu terminal, ingresa el siguiente comando:

    git clone https://github.com/FranGonzalez-dev/backend-coder-proyecto.git

Luego, navega hasta la carpeta e instala npm dentro del proyecto.

    cd backend-coder-proyecto
    npm install

## Inicialización 👨‍💻

Ahora, debes inicializar el proyecto.
**Importante**: dado la estructura del proyecto, primero debes navegar a la carpeta *"/src"* dentro del proyecto. Una vez allí, lanza el servidor ejecutando el archivo *server.js*.

    cd src
    node --watch server.js

¡Felicidades 🎉!  El servidor ha sido inicializado en el puerto **localhost:8080**

## Rutas 🧭

Tal como indica la consigna, de momento el servidor cuenta con dos rutas en particular.
[localhost:8080/api/products](http://localhost:8080/api/products) para la lista de productos.
[localhost:8080/api/carts](http://localhost:8080/api/carts) para ver la lista de carritos de compras.
Ambas rutas cuentan con sus sub-rutas internas.

### Ruta Products

La ruta cuenta con los siguientes métodos:

 **GET**:
El método GET en la ruta raíz *"api/products"* devuelve la lista de todos los productos disponibles. Por ejemplo:

    GET localhost:8080/api/products

Además, puede hacerse la llamada con un límite para los productos, haciendo uso de *"?limit="* en la llamada. Por ejemplo:

    GET localhost:8080/api/products?limit=5

 **GET BY ID**:
Devuelve el producto que el usuario especifique en la ruta *"api/products/:id"*. Por ejemplo:

    GET localhost:8080/api/products/1

**POST**:
Permite al usuario añadir un producto nuevo en la ruta raíz:

    POST localhost:8080/api/products

En este caso, los datos para el nuevo producto entran en el body de la llamada. En mi caso, utilicé [thunder client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) para generar la instancia POST.
A continuación, te dejo un ejemplo de un producto para utilizar en el *body* de la request.

    {
	    "title": "Producto",
	    "description": "El producto es genial!",
	    "price": 300,
	    "code": "#abc123"
	    "stock": 10
    }

**PUT**:
El método PUT permite al usuario actualizar los datos de un producto en específico. Requiere que el usuario indique ID del producto que quiere actualizar.

    PUT localhost:8080/api/products/1

Además, debe agregar los datos que quiere cambiar en el *body* de la request.

    {
	    "description": "El producto no es tan genial :(",
	    "price": 2000,
    }

**DELETE**:
Permite al usuario eliminar un producto en específico. Es necesario que el usuario indique el ID del producto.

    DELETE localhost:8080/api/products/1

### Ruta Carts

**GET**:
Usar el método GET en la ruta raíz muestra todos los carritos disponibles.

    GET localhost:8080/api/carts

**GET BY ID**:
Se puede también obtener un carrito en específico, haciendo uso del ID para su búsqueda:

    GET localhost:8080/api/carts/1

**POST**:
El uso del método POST permite al usuario crear un carrito, si es utilizado en la ruta raíz.

    POST localhost:8080/api/carts

**POST** - Añadir al carrito:
Para añadir un producto al carrito, es necesario hacer uso del ID del carrito que el usuario quiera utilizar, así como también debe hacer uso del ID del producto que el usuario desee agregar. El endpoint sería así *"localhost:8080/:cartID/product/:productID"*. Por ejemplo:

    POST localhost:8080/1/product/2

Por el momento, solo se puede agregar **un producto a la vez**.
Además, el código previene que un producto se repita dentro de un mismo carrito. Esto quiere decir qué, si el usuario agregó varias veces el mismo producto, se mantendrá solamente el que ingresó por primera vez, pero se actualizará el parámetro *quantity* dentro del carrito.

## Dependencias 🎯

Express: 4.18.2 | Framework backend
