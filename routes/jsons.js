import { Router } from 'express';
import pizza from '../schemas/pizza';
import jsonfile from 'jsonfile';
import subclass from '../schemas/subclass';
import topping from '../schemas/topping';

const router = Router();

router.get("/topping", (req, res, next) => {
    const json = `public/json/toppings.json`;
    jsonfile.readFile(json, function (err, obj) {
        if (err) {
            console.log("error", err);
            console.log("나는 바보입니다 ㅠㅠ");
        } else {
            obj.forEach(arr => {
                const toppingAppend = new subclass();
                toppingAppend.name = arr.topping
                toppingAppend.category = arr.category
                const aws = "https://jsa-img.s3.ap-northeast-2.amazonaws.com/topping/"
                toppingAppend.image = aws + arr.imgPath
                toppingAppend.resultImage = aws + arr.resultPath
                toppingAppend.save(function (err, res) {
                    if (err) {
                        return console.log(err)
                    } else {
                        console.log("오오 성공", res);
                    }
                })

            })
        }
    })
    res.json({ result: "성공했으면 좋겠다2" });
})

// 피자 정보 DB 추가
router.get("/topping/append/:brand", (req, res, next) => {
    let brand = req.params.brand;
    const file = `public/json/${brand}.json`;
    console.log("나는 바보에요...", file);
    jsonfile.readFile(file, function (err, obj) {
        if (err) {
            console.log("error", err);
        } else {
            for (let i = 0; i < obj.length; i++) {
                const pizzaAppend = new pizza();
                pizzaAppend.brand = obj[i].brand;
                pizzaAppend.name = obj[i].pizza_name;
                pizzaAppend.m_price = obj[i].price;
                pizzaAppend.m_cal = obj[i].calorie;
                pizzaAppend.toppings = obj[i].topping;
                const aws = "https://jsa-img.s3.ap-northeast-2.amazonaws.com/pizza/"
                const path = aws + obj[i].image;
                pizzaAppend.image = path;
                pizzaAppend.details = obj[i].short_info;
                pizzaAppend.save(function (err, res) {
                    if (err) {
                        return console.error(err);
                    } else {
                        console.log("성공", res);
                    }
                });
            }
        }

    })
    res.json({ result: "성공했으면 좋겠다" });
})


router.get("/last", (req, res, next) => {
    const json = `public/json/lastObject.json`;
    jsonfile.readFile(json, function (err, obj) {
        if (err) {
            console.log(err);
        } else {
            var obj = obj;
            obj.forEach(arr => {
                const last = new topping();
                try {
                    subclass.findOne({ name: arr.integration }, { _id: 1 }, (err, item) => {
                        if (err) {
                            console.log(err);
                        } else {
                            last.name = arr.origin;
                            last.subclass = item;
                            last.save(function (err, res) {
                                if (err) {
                                    return console.log(err);
                                } else {
                                    console.log("성공이닷", res);
                                }
                            })
                        }
                    })
                } catch (err) {
                    return err;
                }

            })
        }
    })
    res.json({ result: "성공했으면 좋겠다. " })
})

router.get("/update/json", (req, res) => {
    const json = "public/json/integration.json";
    jsonfile.readFile(json, function (err, obj) {
        if (err) {
            console.log("저는 바보에요");
        } else {
            let toppings = []
            obj.meat.forEach(arr => {
                toppings.push({
                    topping: arr,
                    category: "meat",
                    imgPath: "",
                    resultPath: ""
                })
            });
            obj.seafood.forEach(arr => {
                toppings.push({
                    topping: arr,
                    category: "seafood",
                    imgPath: "",
                    resultPath: ""
                })
            });
            obj.vegetable.forEach(arr => {
                toppings.push({
                    topping: arr,
                    category: "vegetable",
                    imgPath: "",
                    resultPath: ""
                })
            });
            obj.sauce.forEach(arr => {
                toppings.push({
                    topping: arr,
                    category: "sauce",
                    imgPath: "",
                    resultPath: ""
                })
            })
            obj.cheese.forEach(arr => {
                toppings.push({
                    topping: arr,
                    category: "cheese",
                    imgPath: "",
                    resultPath: ""
                })
            })
            obj.etc.forEach(arr => {
                toppings.push({
                    topping: arr,
                    category: "etc",
                    imgPath: "",
                    resultPath: ""
                })
            })

            jsonfile.writeFile('toppings.json', toppings)
            res.json({
                "res": "제발..."
            })
        }
    })
})


module.exports = router;
