import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Mod } from '../models/mod.js';
import 'dotenv/config';
import axios from 'axios';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


export const loginAdmin = async (req, res) => {
    try{
        const { username , password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const mod = await Mod.findOne({ username });
        if (!mod) {
            console.log('Mod does not exist');
            return res.status(400).json({ message: 'Mod does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, mod.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if(mod.isBanned){
            return res.status(401).json({ error: 'You are banned' });
        }
        
        const token = jwt.sign({ username: mod.username , role : mod.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.cookie('admin_jwt', token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production'
        });

        console.log('Login successful');

        res.status(200).redirect('/admin/admin_dashboard');
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signupAdmin = async (req, res) => {
    try{
        const { username , mobileNumber , email , password , role } = req.body;
        if (!username || !mobileNumber || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const mod = await Mod.findOne({ username });
        if (mod) {
            return res.status(400).json({ message: 'Mod already exists' });
        }

        const newMod = new Mod({
            username,
            mobileNumber,
            email,
            password,
            role
        });

        await newMod.save();

        console.log('Mod created successfully');

        res.status(201).redirect('/admin');
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}


export const getAdminDashboard = async (req, res) => {
    try{
        const token = req.cookies.admin_jwt;

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
        const role = decodedToken.role;


        const mod = await Mod.findOne({ username , role });

        res.render('admin_dashboard' , { mod });

    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: 'Error at getAdminDashboard' });
    }

}

export const getModerators = async (req, res) => {
    try {
        const token = req.cookies.admin_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { username, role } = decodedToken;

        const mod = await Mod.findOne({ username, role });

        if (!mod) {
            return res.status(400).json({ message: 'Invalid moderator credentials' });
        }

        // Find all moderators
        const moderators = await Mod.find({ role: 'moderator' });

        res.status(200).json({ moderators });
    } catch (err) {
        console.error('Error in getModerators:', err.message);
        res.status(500).json({ message: 'Server error in retrieving moderators' });
    }
};

export const getDonors = async (req , res) => {
    try {
        const token = req.cookies.admin_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { username, role } = decodedToken;

        const mod = await Mod.findOne({ username, role });

        if (!mod) {
            return res.status(400).json({ message: 'Invalid moderator credentials' });
        }

        const response = await axios.get('http://localhost:9500/donor/getDonors', {
            headers: {
                Cookie: `admin_jwt=${token}`
            }
        });

        const donors = response.data.donors;

        res.status(200).json({ donors });
    }catch(err){
        console.error('Error in getDonors:', err.message);
        res.status(500).json({ message: 'Server error in retrieving donors' });
    }
};

export const getAdmins = async (req, res) => {
    try {
        const token = req.cookies.admin_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { username, role } = decodedToken;

        const mod = await Mod.findOne({ username, role });

        if (!mod) {
            return res.status(400).json({ message: 'Invalid moderator credentials' });
        }

        const admins = await Mod.find({ role: 'admin' });

        res.status(200).json({ admins });
    } catch (err) {
        console.error('Error in getAdmins:', err.message);
        res.status(500).json({ message: 'Server error in retrieving admins' });
    }
}


export const toggleBan = async (req, res) => {
    try {
        const token = req.cookies.admin_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { username, role } = decodedToken;

        const targetId = req.params.modId; // This should reference the ID of the user to be banned

        // Determine the target user type based on the ID format or use another logic to identify the model
        let targetUser;
        if (role === 'superuser' || role === 'moderator') {
            targetUser = await Mod.findById(targetId); // Assume modId for moderators and admins
        } else {
            targetUser = await Donor.findById(targetId); // Assume modId for donors
        }

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Role-specific banning logic
        if (role === 'superuser') {
            // Superuser can ban moderators and admins
            const updatedIsBanned = !targetUser.isBanned;
            await Mod.findByIdAndUpdate(targetId, { isBanned: updatedIsBanned }, { new: true });
            return res.status(200).json({ success: true, message: 'Ban status updated', isBanned: updatedIsBanned });
        } else if (role === 'moderator') {
            // Moderator can ban admins and donors
            if (targetUser.role === 'admin' || targetUser instanceof Donor) {
                const updatedIsBanned = !targetUser.isBanned;
                await Mod.findByIdAndUpdate(targetId, { isBanned: updatedIsBanned }, { new: true });
                return res.status(200).json({ success: true, message: 'Ban status updated', isBanned: updatedIsBanned });
            } else {
                return res.status(403).json({ success: false, message: 'Moderators cannot ban other moderators' });
            }
        } else if (role === 'admin') {
            // Admin can only ban donors
            if (targetUser instanceof Donor) {
                const updatedIsBanned = !targetUser.isBanned;
                await Donor.findByIdAndUpdate(targetId, { isBanned: updatedIsBanned }, { new: true });
                return res.status(200).json({ success: true, message: 'Ban status updated', isBanned: updatedIsBanned });
            } else {
                return res.status(403).json({ success: false, message: 'Admins cannot ban moderators' });
            }
        } else {
            return res.status(403).json({ success: false, message: 'Insufficient permissions' });
        }
    } catch (err) {
        console.error('Error in toggleBan:', err.message);
        res.status(500).json({ message: 'Server error while toggling ban status' });
    }
};


export const logoutAdmin= async (req, res) => {
    try {
        res.clearCookie('admin_jwt');
        res.status(200).redirect('/');
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const changeRole = async (req, res) => {
    try {
        const { modId } = req.params;
        const { role } = req.body;

        const validRoles = ['moderator', 'admin', 'superuser'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const updatedMod = await Mod.findByIdAndUpdate(modId, { role }, { new: true });

        if (!updatedMod) {
            return res.status(404).json({ success: false, message: 'Mod not found' });
        }

        res.status(200).json({ success: true, message: 'Role updated successfully', mod: updatedMod });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ success: false, message: 'Server error while updating role' });
    }
};
