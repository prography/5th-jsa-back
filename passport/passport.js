import passportJwt from 'passport-jwt';
import User from '../schemas/user';
import dotenv from 'dotenv';
dotenv.config();


const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt; 
const keys = `${process.env.secretKey}`;
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys;

module.exports = passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        User.findById(jwt_payload.id)
            .then(user => {
                if(user){
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }))
}

