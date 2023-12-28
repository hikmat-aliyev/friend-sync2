const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

router.post('/submit', async (req, res) => {
  const data = req.body;
  const userInfo = data.user;
  const postInfo = data.post;
  const user = await User.findById({_id: userInfo.userId})
  try{
    const post = await Post.create({
      user: user._id,
      text: postInfo,
      date: new Date()
    })
    await post.save();
    console.log(post)
  }catch(err){
    res.status(500) 
  }
  const posts = await Post.find({user: user._id})
  res.json(posts)
})

module.exports = router;