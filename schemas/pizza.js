import mongoose from 'mongoose';

const { Schema } = mongoose;

const pizzaSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    m_price: { // 레귤러 사이즈 가격
        type: Number,
        required: true,
    },
    m_cal: { // 레귤러 사이즈 칼로리
        type: Number,
        required: true,
    },
    toppings: { 
        type: Array,
        required: true,
        default: [],
    },
    subclasses: {
        type: Array,
        required: true,
        default: [],
    },
    image: {
        type: String,
    },
    details: {
        type: String,
    },
    comments: [
        {
            user: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('Pizza', pizzaSchema);
