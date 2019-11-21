import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../schemas/user';

module.exports = passport => {    
    const LocalStrategy = passportLocal.Strategy;
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        try {
            const existedUser = await User.findOne({ email });
            if (existedUser) {
                const result = await bcrypt.compare(password, existedUser.password);
                if (result) {
                    done(null, existedUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};