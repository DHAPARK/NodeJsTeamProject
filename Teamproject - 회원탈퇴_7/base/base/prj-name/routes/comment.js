const express = require('express');
const { Comment,Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

//댓글 추가
//comment/addComment/${nickname}/${postId}/${myId}/${content}
router.get('/addComment/:usernick/:postId/:myId/:content',isLoggedIn,(req,res)=>{
    var usernick = req.params.usernick;
    var postId = req.params.postId;
    var myId = req.params.myId;
    var content = req.params.content;
    console.log(usernick);
    console.log(postId);
    console.log(myId);
    console.log(content);

    
    console.log('addComment 연결확인');
    const one = ()=>{
        return new Promise((resolve,reject)=>{
        Comment.create({
            whoWrite:usernick,
            postId:postId,
            UserId:myId,
            contents:content
        })
        resolve();
        })
    }

    const two = ()=>{
        return new Promise((resolve,reject)=>{
        res.redirect('/');
        resolve();
        });
    }
    const doit = async()=>{
        await one();
        await two();
    }
    doit();
    //sequelize 업데이트 실험
    
})
//댓글 추가

module.exports = router;