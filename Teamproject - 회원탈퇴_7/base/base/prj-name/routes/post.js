const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});
//글 비활성화
router.post('/delPost',isLoggedIn,upload.none(),(req,res)=>{
  //const userId = req.body.userId;
  const postId = req.body.postId;

  console.log('delPost 연결확인');
  //console.log(`req.body ${userId}`);
  console.log(`req.body ${postId}`);

  const one = ()=>{
    return new Promise((resolve,reject)=>{
      Post.update({visibility:"0"},{where:{id:postId}});
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
//글 비활성화


//글 활성화
router.post('/addPost',isLoggedIn,upload.none(),(req,res)=>{
  //const userId = req.body.userId;
  const postId = req.body.postId;

  console.log('addPost 연결확인');
  //console.log(`req.body ${userId}`);
  console.log(`req.body ${postId}`);

  const one = ()=>{
    return new Promise((resolve,reject)=>{
      Post.update({visibility:"1"},{where:{id:postId}});
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
//글 활성화



//글의 수정

router.post('/modifyPost',isLoggedIn,upload.none(),(req,res)=>{
  //const userId = req.body.userId;
  const postId = req.body.postId;
  const content = req.body.content;

  console.log('modifyPost 연결확인');
  
  const one = ()=>{
    return new Promise((resolve,reject)=>{
      Post.update({content:content},{where:{id:postId}});
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
//글의 수정




const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user);
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
      visibility: "1",
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//트윗 좋아요
router.post('/:twitId/like', isLoggedIn, async (req, res, next) => {
  try{
      const user = await User.findOne({where: { id: req.user.id }});
      const post = await Post.findOne({where: { id: req.params.twitId }})
      if(user && post){
          await user.addLikedList(parseInt(req.params.twitId), 10); //10진법
          res.send('success');
      }else {
        res.status(404).send('no user or no post');
      }
  } catch(err){
      console.error(err);
      next(err);
  }
})

//트윗 좋아요 취소
router.post('/:twitId/unlike', isLoggedIn, async (req, res, next) => {
  try{
      const user = await User.findOne({where: { id: req.user.id }});
      const post = await Post.findOne({where: { id: req.params.twitId }})
      if(user && post){
          await user.removeLikedList(parseInt(req.params.twitId), 10);
          res.send('success');
      }else {
        res.status(404).send('no user or no post');
      }
  } catch(err){
      console.error(err);
      next(err);
  }
})

module.exports = router;
