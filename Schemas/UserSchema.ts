import mongoose from 'mongoose';

const User = new mongoose.Schema({
    id: { type: String, unique: true, required: true },

    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },

    work: {
        shifts: { type: Number, default: 0 },
        name: { type: String, default: 'None' },
        salary: {
            top: { type: Number, default: 0 },
            bottom: { type: Number, default: 0 }
        }
    } || null
});

export default mongoose.model('User', User);
