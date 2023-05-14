import mongoose from 'mongoose'

const cartsSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }]
});

cartsSchema.pre('findOne', function() {
    this.populate('products')
})

const cartModel = mongoose.model('carts', cartsSchema)
export default cartModel;