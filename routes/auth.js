import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { isLoggedIn, isNotLoggedIn } from '../middlewares';
import User from '../schemas/user';

const router = Router();

router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    const { email, password, nickname } = req.body;
    try {
        const existedUser = await User.findOne({ email });
        if (existedUser) { // 이미 가입된 이메일
            return res.redirect('/signup'); 
        }
        const hash = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hash,
            nickname: nickname,
        });
        await user.save();
        return res.redirect('/signin');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/signin');
        }
        
        return req.logIn(user, loginError => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;