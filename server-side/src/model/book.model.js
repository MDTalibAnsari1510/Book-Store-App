import { Schema, model } from 'mongoose';
const bookSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default:''
    },
    authors: [{ type: Schema.Types.ObjectId, ref: 'user', required: true }],
    status: {
        type: String,
        enum: ['Active', 'In Active'],
        default: 'Active',
    },
    sellCount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        min: 100,
        max: 1000
    },
    isPublished: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

export default model('Book', bookSchema);;