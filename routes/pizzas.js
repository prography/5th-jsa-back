import { Router } from 'express';
import pizzaService from '../services/pizzaService';
import subClass from '../schemas/subclass';

const router = Router();


// router.get('/:brand/:sorting', (req, res, next) => {
//     res.json('선택한 토핑에 따른 추천 피자들');
// });

// router.get('/:id', (req, res, next) => {
//     res.json('피자 상세 정보');
// });

router.get("/", pizzaService.readToppings);
router.get("/result", pizzaService.readTopping);
router.post("/find", pizzaService.findPizza);


module.exports = router;