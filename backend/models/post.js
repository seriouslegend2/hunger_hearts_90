import mongoose from "mongoose";
import { Donor } from './donor.js'; // Import Donor model

const postSchema = new mongoose.Schema({
    donorUsername: { 
        type: String, 
        ref: 'Donor', 
        required: true 
    },
    location: { 
        type: String, 
        required: false  
    },
    availableFood: {
        type: [String], 
        required: true
    },
    timestamp: {
        type: Date, 
        default: Date.now 
    },
    isDealClosed: {
        type: Boolean,
        default: false
    },
    currentlocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    }

});

postSchema.pre('save', async function (next) {
    try {
        const donorExists = await Donor.exists({ username: this.donorUsername });
        if (!donorExists) {
            throw new Error(`Donor with username ${this.donorUsername} does not exist`);
        }

        next();
    } catch (error) {
        next(error);
    }
});

export const Post = mongoose.model("Post", postSchema);
