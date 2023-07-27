import mongoose from "mongoose";


/*
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: String
})
*/
const collection = "users"
const userSchema = new mongoose.Schema({
    first_name: { 
        type: String, required: true 
    },
    last_name: {
        type: String, required: true 
    },
    email: { 
        type: String, required: true, unique: true 
    },
    age: { 
        type: Number, required: true 
    },
    password: { 
        type: String, required: true 
    },
    role: { 
        type: String, default: 'user' 
    },
    cart: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'carts' 
    },
})

mongoose.set('strictQuery', false)
const userModel = mongoose.model(collection, userSchema)

export default userModel;