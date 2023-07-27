import { cartModel } from '../models/models.js'

export default class Cart {
    create   = async () => await cartModel.create({})
    readAll  = async () => await cartModel.find({}).populate('products.product').lean().exec()
    readOne = async ( id ) => await cartModel.findById( id )
    update   = async ( id, data ) => await cartModel.findByIdAndUpdate( id, data, { returnDocument: 'after' }).populate('products.product')
    delete   = async ( id ) => await cartModel.findByIdAndDelete( id ).populate('products.product')
}