import { Router } from 'express';
import pizzas from './pizzas';
import users from './users';
import auth from './auth';
import kakao from './kakao';

// import json from './jsons'

const router = Router();

router.use('/users', users); 
router.use('/pizzas', pizzas);
router.use('/auth', auth);
router.use('/kakao', kakao);
// router.use('/json', json);


module.exports = router;