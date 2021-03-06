import { Router } from 'express';
import pizzas from './pizzas';
import users from './users';
import auth from './auth';
import admin from './admin';
// import json from './jsons'

const router = Router();

router.use('/users', users); 
router.use('/pizzas', pizzas);
router.use('/auth', auth);
router.use('/admins', admin);

// router.use('/json', json);

module.exports = router;