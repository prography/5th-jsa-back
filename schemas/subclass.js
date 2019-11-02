import mongoose from 'mongoose';

const { Schema } = mongoose;

const Subclass = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        
    }
});