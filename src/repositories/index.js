import { Product, Auth, Cart, Ticket } from '../dao/factory.js'
import ProductRepository from './product.repository.js'
import AuthRepository from './auth.repository.js'
import CartRepository from './cart.repository.js'
import TicketRepository from './ticket.repository.js'

export const ProductService = new ProductRepository(new Product())
export const AuthService    = new AuthRepository(new Auth())
export const CartService    = new CartRepository(new Cart())
export const TicketService  = new TicketRepository(new Ticket())