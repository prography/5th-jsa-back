import User from '../schemas/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
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
        res.json({
          name: user.nickname,
          profileImage: user.profile_image,
          recent: user.baskets,
          likes: user.like,
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
module.exports ={
    userCheck,
    userKakao,
    getUserInfo,
}