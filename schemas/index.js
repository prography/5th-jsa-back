import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URI = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@cluster0-qxxzk.mongodb.net/test?retryWrites=true&w=majority`;
module.exports = () => {
    const connect = () => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.connect(URI, { 
            useNewUrlParser: true,
            dbName: 'jsa',
        }, error => {
            if (error) {
                console.log('몽고디비 연결 에러', error);
                process.exit(1);
            } else {
                console.log('몽고디비 연결 성공');
            }
        });
    };
    connect();
    mongoose.connection.on('error', error => {
        console.error('몽고디비 연결 에러', error);
    });
    mongoose.connection.on('disconnected', () => {
        console.error('몽고디비 연결이 끊김. 연결 재시도');
        connect();
    });
};