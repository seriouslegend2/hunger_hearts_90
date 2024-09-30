import express from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { DeliveryBoy } from '../models/deliveryboy.js';
import { Post } from '../models/post.js';
import { Order } from '../models/order.js';
import { User } from '../models/user.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Ensure this is set in your environment variables

// Helper function to calculate the Haversine distance between two points
const getDistance = (lon1, lat1, lon2, lat2) => {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
};

export const findNearbyPosts = async (req, res) => {
    const { postId } = req.query;

    try {
        const token = req.cookies.user_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        
        const username = decodedToken.username;

        // Fetch the post by ID to get its coordinates
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const [postLongitude, postLatitude] = post.currentlocation.coordinates;

        console.log(postLatitude , postLongitude);

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deliveryBoyIds = user.deliveryBoys; // List of ObjectIds for delivery boys

        // Fetch all delivery boys whose IDs match the ones in user.deliveryBoys without using populate
        const deliveryBoys = await DeliveryBoy.find({ _id: { $in: deliveryBoyIds } });
        if (deliveryBoys.length === 0) {
            return res.status(404).json({ message: 'No delivery boys found.' });
        }

        // Create an array to hold delivery boys with their distances
        const deliveryBoysWithDistances = deliveryBoys.map(deliveryBoy => {
            const [boyLongitude, boyLatitude] = deliveryBoy.currentLocation.coordinates || [];
            
            if (boyLongitude == null || boyLatitude == null) {
                console.error(`Invalid coordinates for delivery boy ${deliveryBoy._id}`);
                return { ...deliveryBoy.toObject(), distance: null }; // Explicitly set distance to null
            }
            
            const distance = getDistance(postLongitude, postLatitude, boyLongitude, boyLatitude);

            return { ...deliveryBoy.toObject(), distance }; // Convert deliveryBoy to a plain object and add distance
        });

        // Sort the array by distance and get the closest 5 delivery boys
        const closestDeliveryBoys = deliveryBoysWithDistances
        .filter(boy => boy.distance !== null) // Exclude delivery boys with null distance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

        res.status(200).json({ closestDeliveryBoys });
    } catch (error) {
        console.error('Error fetching nearby users:', error);
        res.status(500).json({ message: 'Error fetching nearby users', error });
    }
};



// // Controller to render the delivery boy form page
// export const getDeliveryBoyPage = async (req, res) => {
//     try {

//         const token = req.cookies.deliveryboy_jwt;

//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Unauthorized' });
//         }

//         const decodedToken = await new Promise((resolve, reject) => {
//             jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//                 if (err) reject(err);
//                 else resolve(decoded);
//             });
//         });
        
//         const username = decodedToken.username;




//         res.render('deliveryboy');
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// };


// Controller to add a new Delivery Boy
export const createDeliveryBoy = async (req, res) => {
    try {
        const { deliveryBoyName, mobileNumber, password, vehicleNo, drivingLicenseNo } = req.body;

        // Ensure coordinates are parsed correctly
        const longitude = parseFloat(req.body.currentLocation.coordinates[0]);
        const latitude = parseFloat(req.body.currentLocation.coordinates[1]);

        if (isNaN(longitude) || isNaN(latitude)) {
            return res.status(400).json({ message: 'Invalid coordinates provided.' });
        }

        // Create the delivery boy object
        const deliveryBoy = new DeliveryBoy({
            deliveryBoyName,
            mobileNumber,
            password, // Hash the password
            vehicleNo,
            drivingLicenseNo,
            currentLocation: {
                type: "Point",
                coordinates: [longitude, latitude] // Ensure these are numbers
            }
        });

        await deliveryBoy.save();
        res.status(201).json({ message: 'Delivery boy created successfully', deliveryBoy });
    } catch (error) {
        console.error('Error adding delivery boy:', error);
        res.status(400).json({ message: 'Error adding delivery boy', error: error.message });
    }
};



// New controller to find nearby users
// export const findNearbyUsers = async (req, res) => {
//     const { deliveryBoyId } = req.params;

//     try {
//         // Fetch the delivery boy by ID
//         const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
//         if (!deliveryBoy) {
//             return res.status(404).json({ message: 'Delivery boy not found' });
//         }

//         const [longitude, latitude] = deliveryBoy.currentlocation.coordinates;

//         // Fetch all users with their locations
//         const users = await User.find({}); // Assuming User model has a 'currentlocation' field

//         // Filter users based on distance
//         const nearbyUsers = users.filter(user => {
//             const userCoordinates = user.currentlocation.coordinates;
//             const distance = getDistance(longitude, latitude, userCoordinates[0], userCoordinates[1]);
//             return distance <= 10000; // For example, 10 km
//         });

//         res.status(200).json({ users: nearbyUsers });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching nearby users', error });
//     }
// };

// // Helper function to calculate distance (as previously defined)
// const getDistance = (lon1, lat1, lon2, lat2) => {
//     const R = 6371e3; // meters
//     const φ1 = lat1 * Math.PI/180;
//     const φ2 = lat2 * Math.PI/180;
//     const Δφ = (lat2-lat1) * Math.PI/180;
//     const Δλ = (lon2-lon1) * Math.PI/180;

//     const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//               Math.cos(φ1) * Math.cos(φ2) *
//               Math.sin(Δλ/2) * Math.sin(Δλ/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//     return R * c; // in meters
// };


export const getDeliveryBoysByUser = async (req, res) => {
    const { userId } = req.params; // Get the user ID from the request parameters

    try {
        // Find the user by userId and populate the deliveryBoys
        const user = await User.findById(userId).populate('deliveryBoys');

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the delivery boys associated with the user
        const deliveryBoys = user.deliveryBoys; // This will be an array of DeliveryBoy objects
        res.status(200).json({ deliveryBoys });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery boys', error });
    }
};

// Controller to get all delivery boys
export const getAllDeliveryBoys = async (req, res) => {
    try {
        // Fetch all delivery boys from the database
        const deliveryBoys = await DeliveryBoy.find({});

        if (deliveryBoys.length === 0) {
            return res.status(404).json({ message: 'No delivery boys found.' });
        }

        res.status(200).json({ deliveryBoys });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery boys', error });
    }
};


export const getDeliveryBoyDashboard = async (req, res) => {
    try {
        const token = req.cookies.deliveryboy_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        
        const username = decodedToken.username;

        const deliveryboy = await DeliveryBoy.findOne({ deliveryBoyName: username });

        if (!deliveryboy) {
            return res.status(404).json({ success: false, message: 'Delivery Boy not found' });
        }

        // Find all orders where the deliveryBoyName matches the delivery boy's username
        const orders = await Order.find({ deliveryBoyName: username });

        // If no orders are found, handle it
        if (!orders.length) {
            return res.status(404).json({ success: false, message: 'No orders found for this delivery boy' });
        }

        // Render the dashboard view with deliveryboy info and their orders
        res.render('deliveryboy_dashboard', { deliveryboy, orders });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


export const addDeliveryBoyToUser = async (req, res) => {
    try {
        const token = req.cookies.user_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        const username = decodedToken.username;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get the delivery boy ID from the request body
        const deliveryBoyName = req.body.deliveryBoyName;

        console.log(req.body);

        // Find the delivery boy by their ID
        const deliveryBoy = await DeliveryBoy.findOne({deliveryBoyName});
        if (!deliveryBoy) {
            return res.status(404).json({ success: false, message: 'Delivery boy not found' });
        }

        // Add the delivery boy's ID to the user's deliveryBoys list
        if (!user.deliveryBoys.includes(deliveryBoy._id)) {
            user.deliveryBoys.push(deliveryBoy._id);
            await user.save();
        }

        res.status(200).json({ success: true, deliveryBoy });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
