import mongoose from 'mongoose';

const RolesSelector = new mongoose.Schema({
    customId: {
        type: String,
        required: true,
        unique: true
    },

    roles: [
        {
            roleId: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: false
            },
            emoji: {
                type: String,
                required: false
            }
        }
    ],

    messages: []
});

export default mongoose.model('RolesSelector', RolesSelector);
