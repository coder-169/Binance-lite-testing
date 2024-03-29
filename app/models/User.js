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
    isVerified: {
        type: Boolean,
        default: false
    },

    byBitSubscribed: {
        type: Boolean,
        default: false,
    },
    byBitApiKey: {
        type: String,        default:""


    },
    byBitSecretKey: {
        type: String,        default:""

    },
    binanceSubscribed: {
        type: Boolean,
        default: false,
    },
    binanceApiKey: {
        type: String,        default:""

    },
    binanceSecretKey: {
        type: String,
        default:""

    },
    kuCoinSubscribed: {
        type: Boolean,
        default: false,
    },
    kuCoinApiKey: {
        type: String, default: ""

    },
    kuCoinSecretKey: {
        type: String,
        default: ""

    },
    kuCoinPassphrase: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user",
    },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User;