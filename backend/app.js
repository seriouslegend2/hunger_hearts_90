import express from 'express';
import ejs from 'ejs';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { fileURLToPath } from 'url';
import { connectDB } from './db/connectDB.js';

import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import postRoutes from './routes/postRoutes.js';
import deliveryboyRoutes from './routes/deliveryboyRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


connectDB();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/" , (req,res) => {
  res.render("whoru");
});

app.get("/u_login", (req, res) => {
  res.render("login_signup");
});

app.get("/d_login" , (req,res) => {
  res.render("login_signup_donor");
});

app.get("/del_login" , (req,res) => {
  res.render("login_signup_deliveryboy");
});

app.get("/admin" , (req,res) => {
  res.render("login_admin");
});


app.use('/admin', adminRoutes);
app.use('/auth' , authRoutes);
app.use('/user', userRoutes);
app.use('/donor', donorRoutes);
app.use('/request' , requestRoutes);
app.use('/post', postRoutes);
app.use('/deliveryboy', deliveryboyRoutes);
app.use('/order', orderRoutes);

const PORT = process.env.PORT || 9500; 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
