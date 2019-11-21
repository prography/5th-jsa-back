import mongoose from 'mongoose';

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const toppingSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subclass: {
        type: ObjectId,
        required: true,
        ref: 'Subclass',
    }
});

module.exports = mongoose.model('Topping', toppingSchema);
