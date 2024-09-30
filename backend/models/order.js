import mongoose from "mongoose";
import { Donor } from './donor.js'; // Import Donor model
import { User } from './user.js'; // Import User model
import { DeliveryBoy } from './deliveryboy.js'; // Import DeliveryBoy model
import { Post } from './post.js';

const orderSchema = new mongoose.Schema({
    donorUsername: { 
        type: String, 
        ref: 'Donor', 
        required: true 
    },
    userUsername: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    deliveryBoy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryBoy',
        required: true
    },
    deliveryBoyName: {
        type: String,
        required: false
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', 
        required: false
    },
    pickupLocation: { 
        type: String, 
        required: false  
    },
    pickupLocationCoordinates: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    deliveryLocation: { 
        type: String, 
        required: false 
    },
    timestamp: {
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: [ 'on-going','picked-up','delivered' ],
        required: true 
    }
});

// Pre-save middleware to validate references
orderSchema.pre('save', async function (next) {
    try {
        const donorExists = await Donor.exists({ username: this.donorUsername });
        if (!donorExists) throw new Error(`Donor with username ${this.donorUsername} does not exist`);
        
        const userExists = await User.exists({ username: this.userUsername });
        if (!userExists) throw new Error(`User with username ${this.userUsername} does not exist`);

        const deliveryBoyExists = await DeliveryBoy.exists({ _id: this.deliveryBoy });
        if (!deliveryBoyExists) throw new Error(`DeliveryBoy with ID ${this.deliveryBoy} does not exist`);

        next();
    } catch (error) {
        next(error);
    }
});

export const Order = mongoose.model("Order", orderSchema);
