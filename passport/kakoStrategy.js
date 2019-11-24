// import kakao from 'passport-kakao';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
const KakaoStrategy = require('passport-kakao').Strategy;
// const KakaoStrategy = kakao.Strategy;


const kakaoKey = {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:3000"
};

module.exports = kakao => {
    passport.use(
        "kakao-login",
        new KakaoStrategy(kakaoKey, (accessToken, refreshToken, profile, done) => {
          console.log(profile);
        })
    );
}