import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
    user:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    pizzaId:{
        type: String
    } 
});

module.exports = mongoose.model('Comment', commentSchema);