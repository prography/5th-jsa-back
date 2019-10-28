import { Router } from 'express';
import { isLoggedIn } from '../middlewares';
import User from '../schemas/user';

const router = Router();

router.use(isLoggedIn);

router.get('/', (req, res, next) => {
  res.sned('마이페이지');
});
 
router.post('/like/:id', (req, res, next) => {
  res.json('좋아요');
});

router.delete('/like/:id', (req, res, next) => {
  res.json('좋아요 취소');
});

router.post('/comment/:id', (req, res, next) => {
  res.json('댓글 달기');
});

module.exports = router;
