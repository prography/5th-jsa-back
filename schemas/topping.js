import mongoose from 'mongoose';

const { Schema } = mongoose;

const toppingSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subclass: {
        type: Object, // { name, image url }
        required: true,
    },
});

module.exports = mongoose.model('Topping', toppingSchema);
