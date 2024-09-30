import { Post } from '../models/post.js';
import { Donor } from '../models/donor.js';

// Create a new post with current location
export const createPost = async (req, res) => {
    const { donorUsername, location, availableFood, longitude, latitude } = req.body;

    try {
        // Check if the donor is banned
        const donor = await Donor.findOne({ username: donorUsername });
        if (!donor) {
            return res.status(404).send('Donor not found');
        }
        if (donor.isBanned) { // Assuming you have an `isBanned` field
            return res.status(403).send('Access denied: You are banned from posting.');
        }

        const newPost = new Post({
            donorUsername,
            location,
            availableFood: availableFood.split(',').map(item => item.trim()),
            currentlocation: {
                type: 'Point',
                coordinates: [longitude, latitude] // Store [longitude, latitude]
            }
        });

        await newPost.save();
        res.redirect('/donor/donor_homepage'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
};
   

// Fetch all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ timestamp: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

export const getPosts = async (req, res) => {
    const { donorUsername } = req.query;
    try {
        const posts = await Post.find({ donorUsername });
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
};





