import productModel from "../models/products.model.js";

export default class Product {
    createProduct = async ( product ) => {
        try {
            let result = await productModel.create( product )
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
    getProducts = async ( page, limit ) => {
        try {
            let result = await productModel.paginate( {},
                { page, limit, lean: true }
            )
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
    getProductByID = async ( id ) => {
        try {
            let result = await productModel.findOne({ _id: id }).lean().exec()
            if( !result ){
                result = 'no-data'
            }
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
    updateProduct = async ( _id, product ) => {
        try {
            let result = await productModel.findByIdAndUpdate( _id, product )
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
    deleteProduct = async ( id ) => {
        try {
            let result = await productModel.findByIdAndDelete({ _id: id });
            return result;
        } catch ( error ) {
            console.log( error )
            return null;
        }
    }
}
