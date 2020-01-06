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
    baskets: {
        type: Array,
        required: true,
        default: [],
    },
    like: {
        type: Array,
        default: [],
    },
    provider: { // 로컬 로그인 안써서 불필요해짐
        type: String,
        required: true,
        default: 'local',
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);