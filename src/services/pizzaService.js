import Pizza from '../schemas/pizza';
import SubClass from '../schemas/subclass';
import Topping from '../schemas/topping';

const recommandPizzas = async (req, res, next) => {  // 피자 추천 api
    try {
        const recomandations = [];
        let items = req.body.items;
        if(!items){
            return res.json({
                result: "no item"
            });
        }
        items = JSON.parse(items);    
        const pizzas = await Pizza.find({},{brand:1, name:1, m_price:1, m_cal:1, subclasses:1, image: 1});
        pizzas.forEach(pizza => {
            if (items.every(x => pizza.subclasses.indexOf(x) !== -1)) {
                pizza.subclasses = undefined;
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
}

const getDetails = async (req, res, next) => { // 피자 상세 정보
    try {
        const pizza = await Pizza.find({ _id: req.params.id }, {subclasses:0, __v:0});
        res.json(pizza[0]);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const getToppings = async (req, res, next) =>{ // 토핑 리스트 보내주기
    try {
        const meat = []; 
        const seafood = [];
        const vegetable = []; 
        const cheese = [];
        const sauce = [];
        const etc = [];

        const items = await await SubClass.find({},{resultImage:0, __v: 0});
        items.forEach(item => {
            if(item.category === "meat") meat.push(item);
            else if(item.category === "seafood") seafood.push(item);
            else if(item.category === "vegetable") vegetable.push(item);
            else if(item.category === "cheese") cheese.push(item);
            else if(item.category === "sauce") sauce.push(item);
            else etc.push(item);
        });
        res.json({
            meat, seafood, vegetable, cheese, sauce, etc
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}


const getToppingImage = async(req, res) =>{
    try {
        const topping = req.query.topping;
        const item = await SubClass.findOne(
            { name: topping },
            { name:1, resultImage:1 });
        res.json({ result: item });
    } catch (error) {
        console.error(error);
        next(error);
    }
}


module.exports = {
    recommandPizzas,
    getDetails,
    getToppings,
    getToppingImage,
}