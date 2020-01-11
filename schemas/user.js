import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    kakao: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    baskets: {
        type: Array,
        required: true,
        default: [],
    },
    like: {
        type: Array,
        required: true,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);