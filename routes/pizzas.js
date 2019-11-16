import { Router } from 'express';
import Pizza from '../schemas/pizza';
import pizzaService from '../services/pizzaService';
import Subclass from '../schemas/subclass';

const router = Router();

router.post('/recomandations', async (req, res, next) => {
    try {
        const recomandations = [];
        let items = req.body.items;
        if(!items){
            return res.json({
                result: "no item"
            })
        }
        console.log(items);
        items = JSON.parse(items);    
        const pizzas = await Pizza.find({},{brand:1, name:1, m_price:1, m_cal:1, subclasses:1, image: 1});
        pizzas.forEach(pizza => {
            if (items.every(x => pizza.subclasses.indexOf(x) !== -1)) {
                console.log(pizza.name)
                pizza.subclasses = undefined
                recomandations.push(pizza);
            }
        });
        let pizzaNum = recomandations.length;
        res.json({
            num: pizzaNum,
            pizzas:recomandations
        });
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