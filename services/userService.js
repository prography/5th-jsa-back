import User from '../schemas/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const userCheck = async (req, res, next) =>{
    try {
        let token = req.headers.authorization
        jwt.verify(token, `${process.env.secretKey}`, async function (err, decoded) {
          if (!err) {
            let id = decoded.id;
            const user = await User.findOne({ _id: id }, {});
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
    userCheck
}