import express from 'express';
import { loginUser , loginDonor , signupUser , signupDonor , logoutUser , logoutDonor,loginDel,signupDel } from '../controllers/authController.js';

const router = express.Router();


router.get('/u_logout', logoutUser);
router.get('/d_logout', logoutDonor);

router.post('/donorLogin', loginDonor);
router.post('/userLogin', loginUser);

router.post('/delLogin',loginDel);
router.post('/delSignup',signupDel);

router.post('/userSignup' , signupUser);
router.post('/donorSignup' , signupDonor);


export default router;