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
  const posts = await Post.find({user: user._id}).sort({ date: -1 }).exec();
  res.json(posts)
})

router.post('/get-posts', async (req, res) => {
  const data = req.body;
  const userInfo = data.user;
  const posts = await Post.find({user: userInfo.userId}).sort({ date: -1 }).exec();
  res.json(posts);
})

router.post('/delete', async (req, res) => {
  try{
    const data = req.body;
    const userInfo = data.user;
    await Post.findOneAndDelete({_id: data.postId});
    const posts = await Post.find({user: userInfo.userId}).sort({ date: -1 }).exec();
    res.json(posts);
  }catch (error) {
    console.error('Error in /like endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/like', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const userInfo = data.user;
    
    // Find the post by _id and update the like_number
    const updatedPost = await Post.findByIdAndUpdate(
      data.postId,
      // Increment the like_number by 1
      { $inc: { like_number: 1 },
      //add user full name and email to likes array
        $push: { likes: {username: userInfo.firstName + ' ' + userInfo.lastName,
                          email: userInfo.email }} },
      { new: true } // Return the updated document
    );
    await updatedPost.save();
    // Find all posts for the user and sort them
    const posts = await Post.find({ user: userInfo.userId }).sort({ date: -1 }).exec();
    res.json(posts);
  } catch (error) {
    console.error('Error in /like endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/unlike', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const userInfo = data.user;
    
    // Find the post by _id and update the like_number
    const updatedPost = await Post.findByIdAndUpdate(
      data.postId,
      // Increment the like_number by 1
      { $inc: { like_number: -1 },
      //add user full name and email to likes array
        $pull: { likes: {email: userInfo.email }} },
      { new: true } // Return the updated document
    );
    await updatedPost.save();
    // Find all posts for the user and sort them
    const posts = await Post.find({ user: userInfo.userId }).sort({ date: -1 }).exec();
    res.json(posts);
  } catch (error) {
    console.error('Error in /like endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

module.exports = router;