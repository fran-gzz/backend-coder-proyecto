import { ticketModel } from '../models/models.js'

export default class Ticket {
    create   = async ( data ) => await ticketModel.create( data )
    readAll  = async () => await ticketModel.find({})
    readOne  = async ( id ) => await ticketModel.findById( id )
    update   = async ( id, data ) => await ticketModel.findByIdAndUpdate( id, data, { returnDocument: 'after' })
    delete   = async ( id ) => await ticketModel.findByIdAndDelete( id )
}