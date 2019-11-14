import pizza from '../schemas/pizza';
import subClass from '../schemas/subclass';
import topping from '../schemas/topping';

const readToppings = async (req, res) =>{
    const meat = []; 
    const seafood = [];
    const vegetable = []; 
    const cheese = [];
    const sauce = [];
    const etc = [];
    await subClass.find({},{resultImage:0, __v: 0}, (err, items)=>{
        if(err){
            console.log(err);
            res.json({
                result: err
            })
        }else{
            items.forEach(item => {
                if(item.category === "meat") meat.push(item);
                else if(item.category === "seafood") seafood.push(item);
                else if(item.category === "vegetable") vegetable.push(item);
                else if(item.category === "cheese") cheese.push(item);
                else if(item.category === "sauce") sauce.push(item);
                else etc.push(item);
            });
            res.json({
                meat : meat,
                seafood: seafood,
                vegetable: vegetable,
                cheese: cheese,
                sauce: sauce,
                etc: etc
            })
        }
    })
}


const readTopping = async(req, res) =>{
    const topping = req.query.topping;
    await subClass.findOne({name: topping},{name:1, resultImage:1}, (err, item)=>{
        if(err){
            console.log(err);
            res.json({
                result: err
            })
        }else{
            console.log(item);
            res.json({
                result: item
            })
        }
        
    })
}

const findPizza = async(req, res, next)=>{
    
    
}

module.exports = {
    readToppings,
    readTopping,
    findPizza
}