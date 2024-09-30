import express from 'express';
import { loginAdmin , signupAdmin , getAdminDashboard , getModerators , getAdmins , changeRole, getDonors , toggleBan , logoutAdmin} from '../controllers/adminController.js';

const router = express.Router();

router.get('/secret' , (req,res) => {
    res.render('signup_admin');
});

router.get('/admin_dashboard' , getAdminDashboard);
router.get('/getModerators', getModerators);
router.get('/getAdmins' , getAdmins)
router.get('/getDonors' , getDonors);


router.post('/changeRole/:modId' , changeRole);
router.post('/signupAdmin' , signupAdmin);
router.post('/loginAdmin' , loginAdmin);
router.get('/logoutAdmin', logoutAdmin);

router.post('/toggleBan/:modId' , toggleBan);


export default router;