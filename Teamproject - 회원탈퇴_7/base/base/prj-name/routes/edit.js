const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/info', isLoggedIn, async (req, res, next) => {
    const { id, email, password, nick, provider} = req.body;
    try {
      var user = await User.findOne({ where: { id } });
      if(provider == 'kakao'){
       
      } 
      else if(provider == 'local'){
        
      }
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

  
module.exports = router;