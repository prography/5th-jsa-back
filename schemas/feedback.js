import mongoose from 'mongoose';

const { Schema } = mongoose;

const feedbackSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Feedback', feedbackSchema);