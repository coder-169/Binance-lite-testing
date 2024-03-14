import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    exchanges: [
        {
            name: {
                type: String,
            },
            apiKey: {
                type: String,

            },
            secretKey: {
                type: String,

            },
            paraphrase: {
                type: String,
            },
            isSubscribed: {
                type: Boolean,
            },
        }
    ],
    role: {
        type: String,
        default: "user",
    },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User;