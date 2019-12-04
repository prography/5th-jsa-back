import { Router } from 'express';
import adminService from '../services/adminService';
const router = Router();

router.get('/dashboard', adminService.dashboard);
router.get('/feedbacks', adminService.feedbacks);




module.exports = router;