import mongoose from 'mongoose';

const { Schema } = mongoose;


const SubclassSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    resultImage:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Subclass', SubclassSchema);