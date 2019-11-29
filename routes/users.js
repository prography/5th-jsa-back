import { Router } from 'express';
import { isLoggedIn } from '../middlewares';
import User from '../schemas/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import Feedback from '../schemas/feedback';

dotenv.config();
const router = Router();

// router.use(isLoggedIn);

router.post('/feedback', async (req, res, next) => {
  try {
    const feedback = new Feedback({ content : req.body.content });
    await feedback.save();
    res.json({
      result: "ok"
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/register', (req, res)=>{
  console.log("test1")
  User.findOne({ email: req.body.email })
    .then(user => {
      if(user){
        return res.status(400).json({
          email: "해당 이메일을 가진 사용자가 존재합니다."
        })
      }else{
        const newUser = new User({
          email: req.body.email,
          password: req.body.password,
          nickname: req.body.nickname
        });

        bcrypt.genSalt(10, (err, salt) =>{
          bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;

            newUser.password = hash;

            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
});

router.post('/login', (req, res)=>{
  const email = req.body.email;
  const password = req.body.password;

  // email로 회원 찾기
  User.findOne({ email })
    .then(user =>{
      if(!user){
        errors.email = "해당하는 회원이 존재하지 않습니다.";
        return res.status(400).json(errors);
      }

      //패스워드 확인
      bcrypt.compare(password, user.password)
        .then(isMatch =>{
          if(isMatch){
            // 회원 비밀번호가 일치할 때
            // JWT PAYLOAD 생성
            const payload = {
              id: user.id,
              name: user.name
            }

            jwt.sign(payload, `${process.env.secretKey}`, { expiresIn: 3600 }, (err, token)=>{
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            });
          }else{
            errors.password = "패스워드가 일치하지 않습니다.";
            return res.status(400).json(errors);
          }
        })
    })
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res)=>{
  res.json({
    id: req.user.id,
    email: req.user.email,
    nickname: req.user.nickname
  })
});

router.get('/', (req, res, next) => {
  res.sned('마이페이지');
});
 
router.post('/like/:id', (req, res, next) => {
  res.json('좋아요');
});

router.delete('/like/:id', (req, res, next) => {
  res.json('좋아요 취소');
});

router.post('/comment/:id', (req, res, next) => {
  res.json('댓글 달기');
});

module.exports = router;
