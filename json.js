const fs = require('fs');
const jsonfile = require('jsonfile');
const file = 'json/school.json';
const pizza = require('./schemas/pizza')

jsonfile.readFile(file, function(err, obj){
    if(err){
        console.log(err);
    }else{
        for(let i=0; i<obj.length())
    }
    
})