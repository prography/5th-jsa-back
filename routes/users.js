import { Router } from 'express';
import User from '../schemas/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Feedback from '../schemas/feedback';
import crypto from 'crypto';
import userService from '../services/userService';

dotenv.config();
const router = Router();

router.get('/', userService.userKakao);
router.get('/check', userService.userCheck);
router.get('/mypage', userService.getUserInfo);
router.get('/likes', userService.getLikes);

router.post('/feedback', async (req, res, next) => {
  try {
    const feedback = new Feedback({ content: req.body.content });
    await feedback.save();
    res.json({
      result: "ok"
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/register', (req, res) => {
  console.log("test1")
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: "User already exists"
        })
      } else {
        // var ciphers = crypto.getCiphers();
        // console.log(ciphers)
        const cryptoPass = crypto.createCipher(
          'aes-256-cbc',
          `${process.env.secretKey}`
        )
        let inputPass = req.body.password;
        let password = cryptoPass.update(inputPass, 'utf8', 'base64');
        password += cryptoPass.final('base64');
        const newUser = new User({
          email: req.body.email,
          password: password,
          nickname: req.body.nickname
        });
        newUser.save()
          .then(user => res.json({
            result: "success"
          }))
          .catch(error => res.json({
            result: "fail"
          }));
      }
    })
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // email로 회원 찾기
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.json({
          result: "No email"
        })
      }

      const cryptoPass = crypto.createCipher(
        'aes-256-cbc',
        `${process.env.secretKey}`
      )

      let comparePass = cryptoPass.update(password, 'utf8', 'base64');
      comparePass += cryptoPass.final('base64');

      console.log(comparePass);
      console.log(user.password)
      //패스워드 확인
      if (comparePass === user.password) {
        // 회원 비밀번호가 일치할 때
        // JWT PAYLOAD 생성
        const payload = {
          id: user.id,
          name: user.name
        }

        jwt.sign(payload, `${process.env.secretKey}`, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: "success",
            token: token
          })
        });
      } else {
        res.json({
          result: "false"
        })
      }
    })
});

module.exports = router;
