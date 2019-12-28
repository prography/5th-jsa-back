import Pizza from '../schemas/pizza';
import SubClass from '../schemas/subclass';
import Topping from '../schemas/topping';
import User from '../schemas/user';
import Comment from '../schemas/comment';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const like = async (req, res, next) => {
    try {
        await Pizza.findOneAndUpdate(
            { idx: req.params.id }, { $push: {likes: req.user.email} }
        );
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const unlike = async (req, res, next) => {
    try {
        await Pizza.findOneAndUpdate(
            { idx: req.params.id }, { $pullAll: { likes: [req.user.email] } } 
        );
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const commentPizza = async (req, res, next) =>{
    try{

        let token = req.headers.authorization

        jwt.verify(token, `${process.env.secretKey}`, async function (err, decoded) {
            if (!err) {
                let id = decoded.id;
                const user = await User.findOne({ _id: id }, {});
                const nickname = user.nickname;
                let pizzaId = req.body.pizza;
                const pizza = await Pizza.findById({ _id: pizzaId })
                let comment = req.body.comment;
                const commentAppend = new Comment();
                commentAppend.user = nickname;
                commentAppend.text = comment;
                commentAppend.pizzaId = pizzaId;
                commentAppend.save(function (err, row) {
                    if (err) {
                        console.log(err);
                        res.json({
                            result: "save error"
                        })
                    }
                })

                const newComment = {
                    user: nickname,
                    text: comment
                }

                pizza.comments.unshift(newComment);
                pizza.save(function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            result: "false"
                        })
                    } else {
                        console.log("test 성공");
                        return res.json({
                            comments: pizza.comments
                        })
                    }
                })

            } else {
                res.json({
                    result: "must login"
                })
            }
        })
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const recommandPizzas = async (req, res, next) => {  // 피자 추천 api
    try {
        const recomandations = [];

        let item = req.body.items;
        let page = req.body.page;
        if(!page){
            page = 1;
        }
        if (!item) {
            return res.json({
                result: "no item"
            });
        }
        const items = item.split(",");
        const pizzas = await Pizza.find({}, { brand: 1, name: 1, m_price: 1, m_cal: 1, subclasses: 1, image: 1 });
        pizzas.forEach(pizza => {
            if (items.some(x => pizza.subclasses.indexOf(x) !== -1)) {
                const pizzaObject = new Object();
                const matchItem = [];
                items.forEach(item => {
                    if (pizza.subclasses.includes(item) === true) {
                        matchItem.push(item);
                    }
                })
                pizzaObject._id = pizza._id;
                pizzaObject.brand = pizza.brand;
                pizzaObject.name = pizza.name;
                pizzaObject.m_price = pizza.m_price;
                pizzaObject.m_cal = pizza.m_cal;
                pizzaObject.image = pizza.image;
                pizzaObject.matchItem = matchItem;
                pizzaObject.correctTopping = matchItem.length;
                //console.log(pizza)
                recomandations.push(pizzaObject);
            }
        });
        let pizzaNum = recomandations.length;
        recomandations.sort(function(a,b){
            return a.correctTopping < b.correctTopping ? 1 : a.correctTopping>b.correctTopping ? -1 : 0;
        })
        let limit = 10;
        let startPaging = (page-1) * limit;
        let lastPaging = limit * page;
        const sliceRecomandations = recomandations.slice(startPaging, lastPaging);
        console.log(sliceRecomandations.length)
        res.json({
            toppings: items.length,
            num: pizzaNum,
            pizzas: sliceRecomandations
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const getDetails = async (req, res, next) => { // 피자 상세 정보
    try {
        const pizza = await Pizza.find({ _id: req.params.id }, { subclasses: 0, __v: 0 });
        res.json(pizza[0]);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const randomPizza = async (req, res, next) => {
    try {
        const pizza = await Pizza.find({}, { subclasses: 0, __v: 0 });
        let len = pizza.length;
        console.log(len);
        let randomNum = Math.floor(Math.random() * len);
        let ranPizza = pizza[randomNum];
        res.json({
            random: ranPizza
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getToppings = async (req, res, next) => { // 토핑 리스트 보내주기
    try {
        const meat = [];
        const seafood = [];
        const vegetable = [];
        const cheese = [];
        const sauce = [];
        const etc = [];

        const items = await SubClass.find({}, { resultImage: 0, __v: 0 });
        items.forEach(item => {
            if (item.category === "meat") meat.push(item);
            else if (item.category === "seafood") seafood.push(item);
            else if (item.category === "vegetable") vegetable.push(item);
            else if (item.category === "cheese") cheese.push(item);
            else if (item.category === "sauce") sauce.push(item);
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


const getToppingImage = async (req, res, next) => {
    try {
        const topping = req.query.topping;
        const item = await SubClass.findOne(
            { name: topping },
            { name: 1, resultImage: 1 });
        res.json({ result: item });
    } catch (error) {
        console.error(error);
        next(error);
    }
}


module.exports = {
    commentPizza,
    recommandPizzas,
    getDetails,
    randomPizza,
    getToppings,
    getToppingImage,
    like,
    unlike,
}