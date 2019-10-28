import { Router } from 'express';
import { isNotLoggedIn } from '../middlewares';

const router = Router();

router.get('/', (req, res, next) => {
    res.send('index 페이지');
});

router.get('/signin', isNotLoggedIn, (req, res, next) => {
    res.send('로그인 페이지');
});

router.get('/signup', isNotLoggedIn, (req, res, next) => {
    res.send('회원가입 페이지');
});

router.get('/events', (req, res, next) => {
    res.send('이벤트 페이지');
});

module.exports = router;