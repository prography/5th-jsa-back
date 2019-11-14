import { Router } from 'express';
import Pizza from '../schemas/pizza';
import pizzaService from '../services/pizzaService';
import subClass from '../schemas/subclass';

const router = Router();

router.post('/recomandations', async (req, res, next) => {
    try {
        const recomandations = [];
        const items = req.body.items;        
        const pizzas = await Pizza.find({});
        pizzas.forEach(pizza => {
            if (pizza.subClasses.every(x => items.indexOf(x) !== -1)) {
                recomandations.push(pizza);
            }
        });
        res.json(recomandations);
    } catch (error) {
        console.error(error);
        next(error);
    } 
});

router.get('/details/:id', async (req, res, next) => { // 피자 상세 정보
    try {
        const pizza = await Pizza.find({ _id: req.params.id });
        res.json(pizza);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get("/toppings", pizzaService.readToppings);
router.get("/result", pizzaService.readTopping);
router.post("/find", pizzaService.findPizza);


module.exports = router;