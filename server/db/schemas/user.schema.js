import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["administrator", "employee", "manager", "user", "guest", ],
            default: "user",
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
        },
        businessEmail: {
            type: String,
            required: false,
            lowercase: true,
        },
        businessContact: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;