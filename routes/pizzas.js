import { Router } from 'express';
import pizzaService from '../services/pizzaService';

const router = Router();

router.post("/comments", pizzaService.commentPizza);
router.post("/recomandations", pizzaService.recommandPizzas);
router.get("/details/:id", pizzaService.getDetails);
router.get("/random", pizzaService.randomPizza);
router.get("/toppings", pizzaService.getToppings);
router.get("/toppings/image", pizzaService.getToppingImage);

module.exports = router;