import { Router } from 'express';
import passport from 'passport';
import kakao from 'passport-kakao';

const KakaoStratege = kakao.Strategy;
const router = Router();

router.get("/", passport.authenticate("kakao-login"));
router.get(
  "/callback",
  passport.authenticate("kakao-login", {
    successRedirect: "/kakao/success",
    failureRedirect: "/kakao/fail"
  })
);

router.get("/success", (req, res)=>{
    res.json({
        result: "success"
    })
})

router.get("/fail", (req, res)=>{
    res.json({
        result: "fail"
    })
})

module.exports = router;
