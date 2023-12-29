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
  const fullName = user.first_name + " "  + user.last_name;
  try{
    const post = await Post.create({
      user: user._id,
      username: fullName,
      text: postInfo,
      date: new Date()
    })
    await post.save();
  }catch(err){
    res.status(500) 
  }
  const posts = await Post.find({user: user._id})
  res.json(posts)
})

router.post('/get-posts', async (req, res) => {
  const data = req.body;
  const userInfo = data.user;
  const posts = await Post.find({user: userInfo.userId}).sort({ date: -1 }).exec();
  res.json(posts);
})

router.post('/delete', async (req, res) => {
  const data = req.body;
  const userInfo = data.user;
  await Post.findOneAndDelete({_id: data.postId});
  const posts = await Post.find({user: userInfo.userId}).sort({ date: -1 }).exec();
  res.json(posts);
})

module.exports = router;