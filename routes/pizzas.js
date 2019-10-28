import { Router } from 'express';
import Pizza from '../schemas/pizza';

const router = Router();

router.get('/:brand/:sorting', (req, res, next) => {
    res.json('선택한 토핑에 따른 추천 피자들');
});

router.get('/:id', (req, res, next) => {
    res.json('피자 상세 정보');
});

module.exports = router;