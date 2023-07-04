import userModel from "../models/user.model.js";

export default class Auth {
    registerUser = async ( user ) => {
        try {
            let result = await userModel.create( user )
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
    getUsers = async () => {
        try {
            let result = await userModel.find()
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
    getUserByEmail = async ( email ) => {
        try {
            let result = await userModel.findOne({ email })
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
    updateUser = async( _id, user ) => {
        try {
            let result = await userModel.findByIdAndUpdate( _id, user )
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
    deleteUser = async( _id ) => {
        try {
            let result = await userModel.findByIdAndDelete( _id )
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
}