import User from '../schemas/user';
import Subclass from '../schemas/subclass';
import Pizza from '../schemas/pizza';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import request from 'request-promise-native';

dotenv.config();

const getKakaoToken = async function(access_token){
  let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': 'Bearer '+ access_token
  }

  let options = {
      url: 'https://kapi.kakao.com/v2/user/me',
      method: 'GET',
      headers: headers,
  }

  const kakaoResult = await request(options, (err, res, body) =>{
      let jsonObj;
      if(!err){
        jsonObj = JSON.parse(body);
      }else{
        console.log("error", err);
        jsonObj = "error"
      }
      return jsonObj;
  })
  return kakaoResult;
}

const userKakao = async (req, res, next) =>{
  try{
    let kakaoToken = req.headers.kakao;
    let kakao = await getKakaoToken(kakaoToken);
    kakao = JSON.parse(kakao);
    const id = kakao.id;
    const email = kakao.kakao_account.email;
    const nickname = kakao.kakao_account.profile.nickname;
    const image = kakao.kakao_account.profile.profile_image_url;
    User.findOne({ kakao : id})
      .then(user =>{
        if(user){
          const payload ={
            id: id,
            nickname: nickname,
          }
          jwt.sign(payload, `${process.env.secretKey}`, { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: "success",
              token: token
            })
          });
        }else{
          const newUser = new User({
            kakao: id,
            email: email,
            nickname: nickname,
            profile_image: image,
          });
          newUser.save();
          const payload ={
            id: id,
            nickname: nickname,
          }
          jwt.sign(payload, `${process.env.secretKey}`, { expiresIn: '7d' }, (err, token) => {
            res.json({
              success: "success",
              token: token
            })
          });
        }
      })
  }catch(err){
    console.log(err);
    next(err);
  }
}

const userCheck = async (req, res, next) =>{
    try {
        let token = req.headers.authorization;
        jwt.verify(token, `${process.env.secretKey}`, async function (err, decoded) {
          if (!err) {
            let kakao = decoded.id;
            const user = await User.findOne({ kakao: kakao }, {kakao:1, nickname:1, profile_image:1});
            res.json({
              user: user,
              login: "true"
            })
          } else {
            res.json({
              login: "false"
            })
          }
        });
      } catch (err) {
        console.log(err);
        next(err);
      }
}

const getUserInfo = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    jwt.verify(token, `${process.env.secretKey}`, async function (err, decoded) {
      if (!err) {
        let kakao = decoded.id;
        const user = await User.findOne({ kakao: kakao }, {});

        const likes = [];
        for (const pizzaId of user.like) {
          let pizza = await Pizza.findOne({_id : pizzaId}, {_id: 1, brand:1, name: 1});
          likes.push(pizza);
        };

        const recent = [];
        const baskets = user.baskets.slice(-7);
        for (const list of baskets) {
          let arr = [];
          if (list.indexOf(',') === -1) {
            const topping = await Subclass.findOne({name: list}, {_id: 1, name: 1, image: 1});
            arr.push(topping);
          } else {
            let toppings = list.split(',');
            for (const topping of toppings) {
              let el = await Subclass.findOne({name: topping}, {_id: 1, name: 1, image: 1});
              arr.push(el);
            }  
          }
          recent.push(arr);
        };
        res.json({
          name: user.nickname,
          profileImage: user.profile_image,
          recent: recent,
          likes: likes,
        });
      } else {
        res.json({
          result: "must login"
        })
      }
    });    
  } catch (error) {
    console.error(error);
    next(error);
  }
}

const getLikes = async (req, res, next) => {
  try {
    const pizzas = await Pizza.find({_id: {$in: req.body.likes}}, 
      {_id: 1, brand: 1, name: 1, m_price: 1, m_cal: 1, subclasses: 1, image: 1, comments: 1, like: 1 });
      res.json(pizzas);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports ={
    userCheck,
    userKakao,
    getUserInfo,
    getLikes,
}