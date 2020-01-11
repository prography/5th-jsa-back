import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
    user:{
        type: String,
        required: true
    },
    pizzaId:{
        type: String
    },
    text:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('Comment', commentSchema);