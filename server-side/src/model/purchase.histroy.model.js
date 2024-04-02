import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    purchaseId: {
        type: Number,
        unique: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now()
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

export default mongoose.model('Purchase', purchaseSchema);