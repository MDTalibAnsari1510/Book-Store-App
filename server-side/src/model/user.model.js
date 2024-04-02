import { Schema, model } from 'mongoose';
const userSchema = new Schema({

    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['admin', 'author', 'retail'],
        default: 'retail'
    },
    status: {
        type: String,
        enum: ['Active', 'In Active'],
        default: 'Active',
    }
}, {
    timestamps: true
});

export default model('User', userSchema);;