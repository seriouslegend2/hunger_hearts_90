import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import {
  Request
} from '../models/request.js';
import {
  Post
} from '../models/post.js';
import {
  Order
} from '../models/order.js';
import { DeliveryBoy } from '../models/deliveryboy.js';
const app = express();


const url = process.env.URL;

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cookieParser());

export const assignOrder = async (req, res) => {
  const { requestId, deliveryBoyId, deliveryLocation } = req.body;

  try {
      // Find the request details
      const request = await Request.findById(requestId);
      if (!request) return res.status(404).json({ message: "Request not found" });

      // Find the post to get the pickup coordinates
      const post = await Post.findById(request.post_id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
      // Create a new order
      const newOrder = new Order({
        donorUsername: request.donorUsername,
        userUsername: request.userUsername,
        post_id: request.post_id,
        pickupLocation: post.location || "N/A",
        pickupLocationCoordinates: {
            type: post.currentlocation.type,
            coordinates: post.currentlocation.coordinates
        },
        deliveryLocation,
        deliveryBoy: deliveryBoyId,
        deliveryBoyName: deliveryBoy.deliveryBoyName,
        status: "on-going",
    });

      // Save the order to the database
      await newOrder.save();

      // Update the request to reflect that the delivery is assigned
      request.deliveryAssigned = true;
      await request.save();

      // Send a success response
      res.status(201).json({
          message: "Order created successfully",
          newOrder
      });
  } catch (error) {
      console.error("Error assigning order:", error);
      res.status(500).json({ message: "Server error" });
  }
};


export const getOrders = async (req, res) => {

  try {
    const token = req.cookies.user_jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const decodedToken = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const username = decodedToken.username;

    // Find all orders for the given userUsername
    const userOrders = await Order.find({
      userUsername: username
    });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({
        message: 'No orders found for this user.'
      });
    }

    // Respond with the list of orders
    res.status(200).json({
      assignedOrders: userOrders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};


export const setOrderDelivered = async (req,res) => {
  const orderId = req.body.orderId;
    
  try {
      // Assuming you are using Mongoose
      await Order.findByIdAndUpdate(orderId, { status: 'delivered' });

      res.redirect('/deliveryboy/getDeliveryBoyDashboard'); // Redirect to dashboard or wherever you need.
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).send('Error updating order status');
  }
};

export const setOrderPickedUp= async (req,res) => {
  const orderId = req.body.orderId;
    
  try {
      // Assuming you are using Mongoose
      await Order.findByIdAndUpdate(orderId, { status: 'picked-up' });

      res.redirect('/deliveryboy/getDeliveryBoyDashboard'); // Redirect to dashboard or wherever you need.
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).send('Error updating order status');
  }
};