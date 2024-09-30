import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { DeliveryBoy } from "./deliveryboy.js";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    address: {
        doorNo: { type: String, required: true },
        street: { type: String, required: true },
        landmarks: { type: String },
        townCity: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        coordinates: {
            type: { type: String, default: 'Point' }, 
            coordinates: { type: [Number], required: true } // Longitude and Latitude
        }
    },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Array of references to DeliveryBoy model
    deliveryBoys: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeliveryBoy' // Reference to the DeliveryBoy model
        }
    ]
});

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

export const User = mongoose.model("User", userSchema);
