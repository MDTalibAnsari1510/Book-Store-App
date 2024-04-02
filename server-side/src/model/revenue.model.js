import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Revenue', revenueSchema);