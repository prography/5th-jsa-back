import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';
import session from 'express-session';
import createError from 'http-errors';
import passport from 'passport';
import dotenv from 'dotenv';
import flash from 'connect-flash';
import cors from 'cors';

import connect from './schemas';
import routes from './routes';
import passportConfig from './passport';

const app = express();
connect(); // db 연결
dotenv.config();
passportConfig(passport);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.COOKIE_SECRET,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
// }));
app.use(flash());
app.use(passport.initialize());
// app.use(passport.session());
app.use(cors())
/////// 테스트 용
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.get("/", (req, res)=>{
  console.log("연결!")
  res.render("kakao.html")
})
//////
app.use(routes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    "result":"error"
  });
});

module.exports = app;