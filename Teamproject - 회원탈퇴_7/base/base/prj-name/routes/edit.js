const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/info', isLoggedIn, async (req, res, next) => {
  try{
    if(req.body.provider == 'local'){
      const id = req.body.id;
      const email2 = req.body.email2;
      const password2 = req.body.password2;
      const nick2 = req.body.nick2;

      const hash = await bcrypt.hash(password2, 12);
      var user = await User.findOne({ where: { id } })

      await user.update({
        email: email2,
        password: hash,
        nick: nick2
      })
    }
    else if(req.body.provider == 'kakao'){
      const id = req.body.id;
      const nick2 = req.body.nick2;

      var kUser = await User.findOne({ where: { id } })
      await kUser.update({
        nick: nick2
      })
    }
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

  
module.exports = router;