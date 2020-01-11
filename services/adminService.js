import User from '../schemas/user';
import Pizza from '../schemas/pizza';
import Subclass from '../schemas/subclass';
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
        console.error(error);
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
        console.error(error);
        next(error);
    }
}

const updateToppingName = async (req, res, next) => {
    try {
        const prev = req.body.prev;
        const next = req.body.next;
        await Subclass.updateOne( { name: prev }, { name: next });
        res.json( {name: next} );
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const updateToppingCategory = async (req, res, next) => {
    try {
        const id = req.body.id;
        const category = req.body.category;
        await Subclass.updateOne( { _id: id }, { category: category });
        res.json( {category: category} );
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const updateToppingImage = async (req, res, next) => {
    try {
        const image = req.file.location;
        const id = req.body.id;
        if (req.params.size === 'large') {
            await Subclass.updateOne({ _id: id }, { resultImage: image });
        } else if (req.params.size === 'small') {
            await Subclass.updateOne({ _id: id }, { image: image });
        }
        res.json({"url": image});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

// api 문서 수정 필요
const deleteTopping = async (req, res, next) => {
    try {
        const name = req.body.name;
        await Subclass.deleteOne({ name: name });
        res.json({
            result: 'ok',
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const addTopping = async (req, res, next) => {
    try {
        const name = req.body.name;
        const category = req.body.category;
        const image = req.files.small[0].location;
        const resultImage = req.files.large[0].location;
        const subclass = await new Subclass({
            name, category, image, resultImage
        });
        await subclass.save();
        res.json({
            "smallImageURL": image,
            "largeImageURL": resultImage,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({isAdmin: false});
        res.json(users);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const addAdmin = async (req, res, next) => {
    try {
        const id = req.body.id;
        await User.updateOne({ _id: id }, { isAdmin: true });
        res.json({
            result: 'ok',
        });
    } catch (error) {
        console.l=error(error);
        next(error);
    }
}

module.exports = {
    dashboard,
    feedbacks,
    updateToppingName,
    updateToppingCategory,
    updateToppingImage,
    deleteTopping,
    addTopping,
    getUsers,
    addAdmin,
}