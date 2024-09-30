import express from 'express';
import { addUser , getUserHomePage , sendRequest , updateUserLocation} from "../controllers/userController.js";

const router = express.Router();

router.get('/user_homepage' , getUserHomePage);

router.post('/addUser' , addUser);
router.post('/update-user-location/:userId', updateUserLocation);
router.post('/sendRequest' , sendRequest);

export default router;