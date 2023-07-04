# backend-coder | TODO:


## General:

* Reemplazar la autenticación del proyecto con **express-session** por **jsonwebtoken**. ✅
* Refactorizar el código que haga uso de **express-session**. 
* Realizar un controller para la ruta de autenticación. ✅
* Corregir el inicio de sesión con GITHUB y su posterior cierre.
* Renombrar la ruta de "sessions" con algo más genérico, como "auth". ✅
* Dentro del middleware *"authorization"*, se deben establecer las respectivas autorizaciones, de manera tal que:
    * La ruta de productos sea **PUBLICA**. ✅
    * La ruta del carrito de compras deberá estar disponible solo para usuarios  **AUTENTICADOS** (admin/user).
    * La ruta del panel de control solo estará disponible para el **ADMINISTRADOR**.
* Eliminar dependencias sin uso. ✅
* Personalizar las respuestas del servidor de modo que no haya código repetido. ⬜✅(por ahora, solo se hizo con las respuestas negativas)
* Preparar la aplicación para separar el **front** del **back**.

## Para la entrega:

##### Objetivos generales
* Profesionalizar el servidor.

##### Objetivos especificos
* Alicar una arquitectura profesional al servidor.
* Aplicar prácticas de patrones de diseño, mailing y variables de entorno.

##### Se debe entregar:
* Modificar la capa de persistencia para aplicar los conceptos de Factory (opcional), DAO y DTO. ⬜
* El DAO seleccionado (por un parametro de linea de comando como lo hicimos anteriormente) será devuelto por una Factory para que la capa de negocio opere con él. (Factory puede ser opcional)
* Implementar el patrón Repository para trabajar con el DAO en la lógica de negocio.
* Modificar la ruta /current para evitar enviar información sensible, enviar un DTO del usuario solo con información necesaria.
* Realizar un middleware que pueda trabajar en conjunto con la estrategia "current" para hacer un sistema de autorización y delimitar el acceso a dichos endpoints:
    * Solo el administrador puede crear, actualizar y eliminar productos. 
    * Solo el usuario puede enviar mensajes al chat
    * Solo el usuario puede agregar productos a su carrito
* Crear un modelo **Ticket**, el cual contará con tordas las formalizaciones de la compra. Este contará con los campos:
    * Id (autogenerado)
    * code: String que debe autogenerarse y ser único
    * purchase_datetime: Deberá guardar la fecha y la hora exacta en la cual se formalizó la compra (created_at)
    * amount: Number, valor total de la compra.
    * purchaser: String, contrendá el email del usuario asociado al carrito
* Implementar en el router de carts la ruta /:id/purchase, la cual permitirá finalizar el proceso de compra de dicho carrito.
* La compra debe corrobar el stock del producto al momento de finalizarse:
    * Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
    * Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra.
* Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
* En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.
* Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener solo los productos que no pudieron comprarse. Es decir, se filtran los que sí se compraron y se quedan los aquellos que no tenían disponibilidad