import { productModel } from '../models/models.js'

export default class Product {
    create   = async ( data ) => await productModel.create( data )
    readAll  = async ( page, limit ) => await productModel.paginate( {}, { page, limit, lean: true })
    readById = async ( id ) => await productModel.findById( id )
    update   = async ( id, data ) => await productModel.findByIdAndUpdate( id, data, { returnDocument: 'after' })
    delete   = async ( id ) => await productModel.findByIdAndDelete( id )
}