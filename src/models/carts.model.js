import mongoose from 'mongoose'

const cartsSchema = new mongoose.Schema({
    length: {
        type: Number,
        default: 0
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number,
            default: 1
        },
        totalPrice: {
            type: Number,
            default: 0
        }
    }]
});

cartsSchema.pre('findOne', function() {
    this.populate('products.product')
})

const cartModel = mongoose.model('carts', cartsSchema)
export default cartModel;