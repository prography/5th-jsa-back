import { Router } from 'express';
import adminService from '../services/adminService';

import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import fs from 'fs';
import AWS from 'aws-sdk';

AWS.config.loadFromPath(__dirname + '/../config/awsconfig.json');
const awsS3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: awsS3,
        bucket: 'jsa-img/topping',
        key: (req, file, cb) => {
            let ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext)
        },
        acl: 'public-read',
        //limits: {fileSize: 10 * 1024 * 1024},
    }),
});

const router = Router();

router.get('/dashboard', adminService.dashboard);
router.get('/feedbacks', adminService.feedbacks);

router.patch('/topping/name', adminService.updateToppingName);
router.patch('/topping/category', adminService.updateToppingCategory);

router.post('/topping/image/:size', upload.single('img'), adminService.updateToppingImage);

router.delete('/topping', adminService.deleteTopping);
router.post('/topping', upload.fields([{name: 'small'}, {name: 'large'}]), adminService.addTopping);

router.get('/toppings', adminService.getToppings);

module.exports = router;