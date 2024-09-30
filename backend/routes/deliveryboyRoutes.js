import express from 'express';
import { 
    createDeliveryBoy, 
    findNearbyPosts, 
    getAllDeliveryBoys, 
    getDeliveryBoysByUser,
    getDeliveryBoyDashboard,
    addDeliveryBoyToUser
} from '../controllers/deliveryboyController.js';

const router = express.Router();

// Add a new delivery boy
router.post('/createDeliveryBoy', createDeliveryBoy);
router.post('/addDeliveryBoyToUser', addDeliveryBoyToUser);

// Get all delivery boys assigned to a particular user
router.get('/deliveryBoysByUser', getDeliveryBoysByUser);

// Get all delivery boys
router.get('/getAllDeliveryBoys', getAllDeliveryBoys);

// Find nearby users for a delivery boy
router.get('/findNearbyPosts', findNearbyPosts);

router.get('/getDeliveryBoyDashboard', getDeliveryBoyDashboard);

export default router;
