import { Router } from 'express';
import pizza from '../schemas/pizza';
import jsonfile from 'jsonfile';


const router = Router();

router.get('/:brand/:sorting', (req, res, next) => {
    res.json('선택한 토핑에 따른 추천 피자들');
});

router.get('/:id', (req, res, next) => {
    res.json('피자 상세 정보');
});

router.get("/topping/append/:brand", (req, res, next)=>{
    let brand = req.params.brand;
    const file = `public/json/${brand}.json`;
    console.log("나는 바보에요...", file);
    jsonfile.readFile(file, function(err, obj){
        if(err){
            console.log("error", err);
        }else{
            for(let i=0; i<obj.length; i++){
                const pizzaAppend = new pizza();
                pizzaAppend.brand = obj[i].brand;
                pizzaAppend.name = obj[i].pizza_name;
                pizzaAppend.m_price = obj[i].price;
                pizzaAppend.m_cal = obj[i].calorie;
                pizzaAppend.toppings = obj[i].topping;
                pizzaAppend.details = obj[i].short_info;
    
                pizzaAppend.save(function(err, res){
                    if(err){
                        return console.error(err);
                    }else{
                        console.log("성공", res);
                    }
                });
            }
        }
        
    })
    res.json({result: "성공했으면 좋겠다"});
})

module.exports = router;