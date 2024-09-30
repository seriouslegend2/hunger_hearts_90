import mongoose from "mongoose";
import bcrypt from "bcrypt";

const deliveryBoySchema = new mongoose.Schema({
    deliveryBoyName: { type: String, required: true , unique: true },
    mobileNumber: { type: String, required: true },
    password: { type: String, required: true },
    vehicleNo: { type: String, required: true },
    drivingLicenseNo: { type: String, required: true },
    currentLocation: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } // Array of numbers
    }
}, { timestamps: true });

deliveryBoySchema.pre('save', async function (next) {
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

deliveryBoySchema.index({ currentLocation: '2dsphere' }); // Create 2dsphere index for geospatial queries

export const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);
