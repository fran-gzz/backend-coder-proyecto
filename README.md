# backend-coder | TODO:


## General:

* ✅ Reemplazar la autenticación del proyecto con **express-session** por **jsonwebtoken**.
* ✅ Refactorizar el código que haga uso de **express-session**. 
* ✅ Realizar un controller para la ruta de autenticación.
* 🟨Corregir el inicio de sesión con GITHUB y su posterior cierre.
* ✅ Renombrar la ruta de "sessions" con algo más genérico, como "auth".
* Dentro del middleware *"authorization"*, se deben establecer las respectivas autorizaciones, de manera tal que:
    * ✅ La ruta de productos sea **PUBLICA**.
    * ✅ La ruta del carrito de compras deberá estar disponible solo para usuarios  **AUTENTICADOS** (user).
    * ✅ La ruta del panel de control solo estará disponible para el **ADMINISTRADOR**.
* ✅ Eliminar dependencias sin uso.
* ✅ Personalizar las respuestas del servidor de modo que no haya código repetido.
* ✅ Preparar la aplicación para separar el **front** del **back**.


## Para la entrega:

##### Objetivos especificos
* Alicar una arquitectura profesional al servidor.
* Aplicar prácticas de patrones de diseño, mailing y variables de entorno.

##### Se debe entregar:
* ✅ Modificar la capa de persistencia para aplicar los conceptos de Factory (opcional), DAO y DTO.
* ✅ Implementar el patrón Repository para trabajar con el DAO en la lógica de negocio.
* ✅ Modificar la ruta /current para evitar enviar información sensible, enviar un DTO del usuario solo con información necesaria.
* ✅ Realizar un middleware que pueda trabajar en conjunto con la estrategia "current" para hacer un sistema de autorización y delimitar el acceso a dichos endpoints:
    * ✅ Solo el administrador puede crear, actualizar y eliminar productos. 
    * ❌ Solo el usuario puede enviar mensajes al chat (aún no hay chat en la aplicación)
    * ✅ Solo el usuario puede agregar productos a su carrito
* ✅ Crear un modelo **Ticket**, el cual contará con tordas las formalizaciones de la compra. Este contará con los campos:
    * ✅ Id (autogenerado) 
    * ✅ code: String que debe autogenerarse y ser único 
    * ✅ purchase_datetime: Deberá guardar la fecha y la hora exacta en la cual se formalizó la compra
    * ✅ amount: Number, valor total de la compra.
    * ✅ purchaser: String, contrendá el email del usuario asociado al carrito
* ✅ Implementar en el router de carts la ruta /:id/purchase, la cual permitirá finalizar el proceso de compra de dicho carrito.
* ✅ Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.

---
* ✅ Usar Brotli para la compresión de los datos.
* ✅ Generar un módulo de mocking para el servidor, que genere 100 productos con el mismo formato que entregaría una petición de mongo
* ✅ Generar un customizador de errores

---
* ✅ Implementar un logger con winston

