import config from "../config/enviroment.config.js";


export let Product;
export let Auth;
export let Cart;
export let Ticket;


switch ( config.persistance ) {
    case 'MONGO':
        /* Products */
        const { default: ProductMongoDAO } = await import('./mongo/product.mongo.dao.js');
        Product = ProductMongoDAO;

        /* Auth */
        const { default: AuthMongoDAO } = await import('./mongo/auth.mongo.dao.js');
        Auth = AuthMongoDAO

        /* Carts */
        const { default: CartMongoDAO } = await import('./mongo/cart.mongo.dao.js');
        Cart = CartMongoDAO

        /* Ticket */
        const { default: TicketMongoDAO } = await import('./mongo/ticket.mongo.dao.js');
        Ticket = TicketMongoDAO

        break;
    default:
        break;
}


// En la clase 19, a partir del minuto 03:54:54 comienza a explicar el método para usar persistencia con fileSystem