import local from './localStrategy';
import User from '../schemas/user';

module.exports = passport => {
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((email, done) => {
        User.findOne({ email })
            .then(email => done(null, email))
            .catch(err => done(err));
    });

    local(passport);
};