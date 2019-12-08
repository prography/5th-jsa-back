import User from '../schemas/user';
import Pizza from '../schemas/pizza';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import Feedback from '../schemas/feedback';
import Comment from '../schemas/comment';

const dashboard = async (req, res, next) =>{
    try{
        const users = await User.count();
        const pizzas = await Pizza.count();
        const feedbacks = await Feedback.count();
        const comments = await Comment.count();
        let skip = 0;
        if(comments > 10){
            skip = comments - 10;
        }
        const newComments = await Comment.find({}, { _id:0, __v:0 }).skip(skip);
        console.log(comments);
        res.json({
            users: users,
            pizzas: pizzas,
            feedbacks: feedbacks,
            comments: newComments
        })
    }catch(error){
        console.log(error);
        next(error);
    }
}

const feedbacks = async (req, res, next)=>{
    try{
        let page = req.query.page;
        if(!page){
            page = 1;
        }else{
            page = parseInt(page);
        }
        let skip = (page - 1) * 10;
        let limit = 10;
        let feedbackCount = await Feedback.count();
        let pnSize = 10;
        let pnStart = ((Math.ceil(page/pnSize) -1) * pnSize) + 1;
        let pnEnd = (pnStart + pnSize) -1;
        
        let pnTotal = Math.ceil(feedbackCount / limit);
        if(pnEnd > pnTotal){
            pnEnd = pnTotal;
        }

        const feedback = await Feedback.find({}, {}).skip(skip).limit(limit);

        res.json({
            pnStart: pnStart,
            pnEnd: pnEnd,
            paging: page,
            pnTotal: pnTotal,
            feedbacks: feedback
        })
    }catch(error){
        console.log(error);
        next(error);
    }
}

module.exports = {
    dashboard,
    feedbacks
}