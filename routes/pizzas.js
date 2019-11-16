import { Router } from 'express';
import pizzaService from '../services/pizzaService';

const router = Router();

router.post("/recomandations", pizzaService.recommandPizzas);
router.get("/details/:id", pizzaService.getDetails);
router.get("/toppings", pizzaService.readToppings);
router.get("/result", pizzaService.readTopping);
router.post("/find", pizzaService.findPizza);

module.exports = router;