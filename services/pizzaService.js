import Pizza from '../schemas/pizza';
import SubClass from '../schemas/subclass';
import Topping from '../schemas/topping';
import User from '../schemas/user';
import Comment from '../schemas/comment';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import request from 'request-promise-native';

dotenv.config();

const likePizza = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        let pizzaId = req.headers.pizza;
        jwt.verify(token, `${process.env.secretKey}`, async function (err, decoded) {
            if (!err) {
                let id = decoded.id;
                const user = await User.findOne({ kakao: id }, {});
                const pizza = await Pizza.findOne({ _id: pizzaId }, {});
                let like = pizza.like;
                if(like.includes(user.kakao)){
                    //arr.splice(arr.indexOf("A"),1);
                    pizza.like.splice(pizza.like.indexOf(user.kakao), 1);
                    user.like.splice(user.like.indexOf(pizza._id), 1);
                }else{
                    pizza.like.unshift(user.kakao);
                    user.like.unshift(pizza._id);
                }
                await pizza.save();
                await user.save();
                res.json({
                    like: pizza.like
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

const commentPizza = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
	console.log("--------------------------------->", token);
        jwt.verify(token, `${process.env.secretKey}`, async function (err, decoded) {
            if (!err) {
                let id = decoded.id;
                const user = await User.findOne({ kakao: id }, {});
                const nickname = user.nickname;
                const image = user.profile_image;
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
                    text: comment,
                    image: image,
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
        let token = req.headers.authorization;
        const recomandations = [];

        let item = req.body.items;
        let page = req.body.page;
        if (!page) {
            page = 1;
        }

        // 최근 검색 결과 추가
        if(page === 1){
            console.log("test===========>", token);
	    jwt.verify(token, `${process.env.secretKey}`, async function (err, decoded){
                if(!err){
		    console.log("check----------------------------->", token);
                    let id = decoded.id;
                    const user = await User.findOne({ kakao: id }, {});
                    user.baskets.unshift(item);
                    user.save();
                }
            })    
        }


        if (!item) {
            return res.json({
                result: "no item"
            });
        }
        const items = item.split(",");
        let itemsLength = Math.round(items.length / 2);
        const pizzas = await Pizza.find({}, { brand: 1, name: 1, m_price: 1, m_cal: 1, subclasses: 1, image: 1, comments: 1, like: 1 });
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
                pizzaObject.comments = pizza.comments.length;
                pizzaObject.likeNum = pizza.like.length;
                pizzaObject.like = pizza.like;
                pizzaObject.matchItem = matchItem;
                pizzaObject.correctTopping = matchItem.length;
                if(matchItem.length >= itemsLength){
                    recomandations.push(pizzaObject);
                }
                //console.log(pizza)
            }
        });
        let pizzaNum = recomandations.length;
        recomandations.sort(function (a, b) {
            return a.correctTopping < b.correctTopping ? 1 : a.correctTopping > b.correctTopping ? -1 : 0;
        })
        
        res.json({
            toppings: items.length,
            pizzaNum: pizzaNum,
            pizzas: recomandations
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
        if(meat.length === 11){
            let meat_one = meat[1]; // 베이컨
            let meat_three = meat[3]; // 소시지
            let meat_six = meat[6]; // 불고기
            let meat_nine = meat[9]; // 치킨
            meat[1] = meat_six;
            meat[3] = meat_nine;
            meat[6] = meat_one;
            meat[9] = meat_three;
        }
        console.log(meat);
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
            { name: 1, resultImage: 1, z_index: 1 });
        res.json({ result: item });
    } catch (error) {
        console.error(error);
        next(error);
    }
}


module.exports = {
    likePizza,
    commentPizza,
    recommandPizzas,
    getDetails,
    randomPizza,
    getToppings,
    getToppingImage,
}
