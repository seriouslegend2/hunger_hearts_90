import express from 'express';
import { assignOrder , getOrders , setOrderDelivered , setOrderPickedUp } from "../controllers/orderController.js";

const router = express.Router();

router.get('/getOrders' , getOrders);

router.post('/assignOrder' , assignOrder);
router.post('/setOrderDelivered' , setOrderDelivered);
router.post('/setOrderPickedUp' , setOrderPickedUp);
export default router;