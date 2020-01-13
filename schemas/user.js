import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    kakao: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    profile_image: {
        type: String
    },
    baskets: {
        type: Array,
        default: [],
    },
    like: {
        type: Array,
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