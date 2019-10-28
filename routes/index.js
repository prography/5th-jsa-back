import { Router } from 'express';
import pizzas from './pizzas';
import users from './users';
import auth from './auth';
import pages from './pages';

const router = Router();

router.use('/', pages); 
router.use('/users', users); 
router.use('/pizzas', pizzas);
router.use('/auth', auth);

module.exports = router;
