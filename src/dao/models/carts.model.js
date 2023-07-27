import mongoose from 'mongoose'

const cartsSchema = new mongoose.Schema({
    products: [{
        _id: false,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        totalPrice: Number
    }]
});

cartsSchema.pre('findOne', function() {
    this.populate('products.product')
})

mongoose.set('strictQuery', false )
const cartModel = mongoose.model('carts', cartsSchema)
export default cartModel;