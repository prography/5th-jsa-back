import { Router } from 'express';
import adminService from '../services/adminService';

const router = Router();

router.get('/dashboard', adminService.dashboard);
router.get('/feedbacks', adminService.feedbacks);

router.patch('/toppingName', adminService.updateToppingName);
router.patch('/toppingCategory', adminService.updateToppingCategory);
// router.delete('/topping', adminService.deleteTopping);
// router.post('/topping', adminService.addTopping);
// router.patch('/category', adminService.updateCategory);

module.exports = router;