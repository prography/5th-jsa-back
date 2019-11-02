const fs = require('fs');
const jsonfile = require('jsonfile');
const file = 'json/school.json';
const pizza = require('./schemas/pizza');

jsonfile.readFile(file, function(err, obj){
    if(err){
        console.log(err);
    }else{
        for(let i=0; i<obj.length; i++){
            const pizzaAppend = new pizza();
            pizzaAppend.brand = obj[i].brand;
            pizzaAppend.name = obj[i].pizza_name;
            pizzaAppend.m_price = obj[i].price;
            pizzaAppend.m_cal = obj[i].calorie;
            pizzaAppend.toppings = obj[i].topping;
            pizzaAppend.detail = obj[i].short_info;

            pizza.save(function(err, res){
                if(err){
                    return console.error(err);
                }else{
                    console.log("성공", res);
                }
            });
        }
    }
    
})