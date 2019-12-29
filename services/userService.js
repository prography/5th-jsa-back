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
            nickname: nickname
          });
          newUser.save();
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
        }
      })
  }catch(err){
    console.log(err);
    next(err);
  }
}

const userCheck = async (req, res, next) =>{
    try {
        let token = req.headers.authorization
        jwt.verify(token, `${process.env.secretKey}`, async function (err, decoded) {
          if (!err) {
            let kakao = decoded.id;
            const user = await User.findOne({ kakao: kakao }, {});
            const nickname= user.nickname;
            res.json({
              user: nickname
            })
          } else {
            res.json({
              result: "로그인이 되어 있지 않습니다."
            })
          }
        });
      } catch (err) {
        console.log(err);
        next(err);
      }
}

module.exports ={
    userCheck,
    userKakao
}