import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({    
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String
    }
})

const ticketModel = mongoose.model( 'tickets', ticketSchema )
export default ticketModel;