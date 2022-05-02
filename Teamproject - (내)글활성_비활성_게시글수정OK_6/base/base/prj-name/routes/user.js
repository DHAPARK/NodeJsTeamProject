const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//router모듈로 unfollow 관련 url을 만들어줘야함
router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
  console.log('뭐가오나');
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    console.log('여긴가1');
    if (user) {
      console.log('여긴가84');
      await user.removeFollowings(parseInt(req.params.id));
      console.log('여긴가2');
      res.send('success');
      console.log('여긴가4');
    }
  } catch (error) {
    console.log('여긴가3');
    console.error(error);
    next(error);
  }
});
module.exports = router;
