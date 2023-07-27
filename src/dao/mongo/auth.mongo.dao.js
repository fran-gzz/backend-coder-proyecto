import { userModel } from '../models/models.js'

export default class Auth {
    create  = async ( data ) => await userModel.create( data )
    readAll = async () => await userModel.find({})
    readOne = async ( email ) => await userModel.findOne({ email })
    update  = async ( id, data ) => await userModel.findByIdAndUpdate( id, data, { returnDocument: 'after' })
    delete = async ( id ) => await userModel.findByIdAndDelete( id )
}