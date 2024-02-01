import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import './Post.css'
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { handleProfilePage } from '../Profiles/Profile';
import { convertToBase64 } from '../Picture/Picture';
import EditPost from './EditPost/EditPost';
import defaultProfilePic from '../images/default-profile.svg'
import PostsSkeleton from '../PostsSkeleton/PostsSkeleton';

// eslint-disable-next-line react/prop-types
const Post = ({userInfo, profileInfo, path}) => {
  const [posts, setPosts] = useState(null);
  const [createdPost, setCreatedPost] = useState('');
  const [userPost, setUserPost] = useState(null);
  const user = userInfo;

  // set postOwner to profile data if we are in friend page
  const postOwner = profileInfo ? profileInfo : userInfo;

  const [commentInputToggle, setToggle] = useState(false);
  const [commentText, setCommentText] = useState(" ");
  const [showLikeList, setShowLikeList] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [shownCommentNumber, setShownCommentNumber] = useState(-2);
  const [postImage, setPostImage] = useState(null);
  const imageInputRef = useRef(null);
  const [postsLoading, setPostsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false);
  const [activePostIndex, setActivePostIndex] = useState(null);
  const [commentEdit, setCommentEdit] = useState(false);
  const [editedComment, setEditedComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState(null);

  const navigate = useNavigate();

  //get all posts
  useEffect(() => {
    setPostsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_BASE}/post/${path}/get-posts`, {
          postOwner
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }finally {
        setPostsLoading(false);
      }
    };
  
    fetchData();
  }, [postOwner, setActivePostIndex, path]);

  async function handlePostSubmit(e) {
      e.preventDefault();
      try{
        const response = await axios.post(`${API_BASE}/post/submit`, {
          createdPost, user, postImage
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })

        const data = response.data;
        setPosts(data);
        setCreatedPost('');
        setPostImage(null)
      }catch(err){
        console.log(err)
      }
      
  }

  async function handlePostDelete (postId,) {
    try{
      const response = await axios.post(`${API_BASE}/post/delete`, {
        postId, user
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = response.data;
      setPosts(data);
    }catch(err){
      console.log(err)
    }
  }

  async function handlePostLike (postId, index) {
    try{
      axios.post(`${API_BASE}/post/like`, {
        postId, user, postOwner
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      })
      //change the posts locally to avoid waiting to fetch posts from database
      const newPosts  = [...posts];
      newPosts[index].likes.push({
        userId: {
          _id: user._id,
          profile_pic: user.profile_pic,
        },
        username: user.firstName + ' ' + user.lastName,
        email: user.email,
        profile_pic: user.profile_pic
      });
      newPosts[index].like_number = newPosts[index].like_number + 1;
      setPosts(newPosts)
    }catch(err){
      console.log(err)
    }
  }
  

  async function handlePostUnlike (postId ,index) {
    try{
      axios.post(`${API_BASE}/post/unlike`, {
        postId, postOwner, user
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      })
      //change the posts locally to avoid waiting to fetch posts from database

        const newPosts  = [...posts];
        const post = newPosts[index];
        const newLikesArray = post.likes.filter(like => like.email != user.email);
        post.likes = newLikesArray;
        post.like_number = post.like_number - 1;
        setPosts(newPosts); 
    }catch(err){
      console.log(err)
    }
  }

  function isPostLiked(likes) {
    return likes.some(like => like.email == user.email)
  }

  async function handleCommentPost(postId) {
    setCommentText('');
    try{
      const response = await axios.post(`${API_BASE}/post/comment`, {
        postId, user, postOwner, commentText
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = response.data;
      setPosts(data);
    }catch(err){
      console.log(err)
    }
  }

  function handleCommentInput(post) {
    post.showCommentInput = true;
    setToggle(!commentInputToggle);
  }

  function handleLikeList(post) {
    setLikeList(post.likes)
    setShowLikeList(true)
  }


  async function handleCommentDelete(postId, commentId) {
    try{
      const response = await axios.post(`${API_BASE}/post/comment/delete`, {
        postId, postOwner, commentId
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = response.data;
      if(userPost){
        const newCommentsArray = userPost.comments.filter(comment => comment._id != commentId);
        userPost.comments = newCommentsArray;
        setUserPost(userPost);
      }
      setPosts(data);
      
    }catch(err){
      console.log(err)
    }
  }

  const handleFileUpload = async (e) => {
    setPostImage(null)
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage(base64);
    //change value of image input to null as when it is not reset, 
    //and when we want to add the same image it does not trigger onChange function 
    //as it is the same image, meaning there is no change
    imageInputRef.current.value = null;
  }

  function handleCommentEdit(comment) {
    setEditedComment(comment);
    setEditedCommentText(comment.text);
    setCommentEdit(true);
  }


  function handleCommentEditSubmit(postInfo, commentInfo) {
    try{
        axios.post(`${API_BASE}/post/update/comment`, {
        postInfo, commentInfo, editedCommentText
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      })
      commentInfo.text = editedCommentText;
      setCommentEdit(false)
    }catch(err) {
      console.log(err)
    }
  }


  return (
    <div className='post-page'>
      {editMode && <div className="background-layer"></div>}
       <div className='post-container'>
        {!profileInfo && 
        <div className='create-post-container'>
          <form onSubmit={handlePostSubmit}>
            <textarea type="text" placeholder="What's on your mind?" 
            value={createdPost} onChange= {(e) => setCreatedPost(e.target.value)}/>
          </form>

          <div className='post-create-image-container'>
            {postImage && 
            <span onClick={() => setPostImage(null)} className="material-symbols-outlined x-close-button">
              close
            </span>}

            <img src={postImage} className='post-create-image'/>
          </div> 
          
          <input ref={imageInputRef} type='file' label ='Image' name='post_picture' id='post-pic-upload'
              accept='.jpeg, .png, .jpg' onChange={(e) => handleFileUpload(e)}/>

          <div className='upload-and-image-button-container'>
            <label htmlFor="post-pic-upload">
              <span className="material-symbols-outlined post-create-image-icon">
              image
              </span>
            </label>

            <button onClick={handlePostSubmit} className={createdPost.trim() == "" ? 'disabled-postBtn' : 'postBtn'}  type='submit'>
              <span className="material-symbols-outlined post-submit-icon">
                send
              </span>
            </button>
          </div>

        </div>}
        
        {(posts && !postsLoading) ? posts.map((post, index) => (
          <div className='single-post-container' key={index}>

            <div className='post-header'>
              <div>
                <img className='post-owner-profile-pic'
                     src={post.user.profile_pic ? post.user.profile_pic : defaultProfilePic} alt="" />
                <div>
                  <h2>{post.username}</h2>
                  <p>posted {formatDistanceToNow(post.date, {addSuffix: true})}</p>
                </div> 
              </div> 
             
             {/* show if we are not in friend's page and if it is not our friend's post */}
              {(!profileInfo && post.user._id == user._id) &&
                <span onClick={() => setActivePostIndex((prevIndex) => (prevIndex === index ? null : index))} className="more-horiz material-symbols-outlined">
                more_horiz
                {activePostIndex === index ? (
                  <div className='post-dele-edit-btn-container'>
                    <button onClick={() => {
                      setActivePostIndex((prevIndex) => (prevIndex === index ? null : index))  // Set the index first
                      setEditMode(true);
                    }} className='post-edit-button'>
                      Edit
                    </button>
                    <button className='post-delete-button' onClick={() => handlePostDelete(post._id)}>
                      Delete
                    </button>
                  </div>) : null}
              </span>}

            </div>

            {editMode && activePostIndex === index &&
              <EditPost
                setPosts={setPosts}
                index={activePostIndex}
                setEditMode={setEditMode}
                post={posts[activePostIndex]}
                setActivePostIndex={setActivePostIndex}
                editMode={editMode}
              />
            }

            <p className='post-text'>{post.text}</p>
            <img className='single-post-picture' src={post.post_picture}/>

            <div className='like-comment-list-container'>
              { post.like_number > 0 ? 
              <button onClick={() => handleLikeList(post)}>
                {post.like_number} {post.like_number ==1 ? 'like' : 'likes'}
              </button> : <p></p>}
                
              { post.comment_number > 0 ? 
              <button className='comment-number' onClick={() => setShownCommentNumber(-post.comments.length)}>
                {post.comment_number} {post.comment_number == 1 ? 'comment' : 'comments'}
              </button> : <p></p>}
            </div>

            {showLikeList && <div className='list-of-likes'>
              <div className='like-list-header'>
                <span className="material-symbols-outlined">
                  favorite <p>{likeList.length}</p>
                </span>
                <span className="material-symbols-outlined" onClick={() => {setShowLikeList(false)}}>close</span>
              </div>
              {likeList.length > 0 ? likeList.map((like, index) => (
                <div className='like-item' key={index}>
                  <img className='post-owner-profile-pic'
                     src={like.userId.profile_pic } alt="" />
                  <p className='liked-username' key={index} 
                    onClick={() => {
                      handleProfilePage(like.userId, navigate)
                      setShowLikeList(false)
                      }}>
                    {like.username}
                  </p>
                </div>
              )) : <p key={index}>no likes</p>}
            </div>} 

            <div>
              <div className='like-comment-btn-container'>
                {isPostLiked(post.likes) ? 
                <button onClick={() => handlePostUnlike(post._id, index)} className='liked-button'>
                   Liked
                  <span id='like-logo' className="material-symbols-outlined"> favorite </span>
                </button> : <button  onClick={() => handlePostLike(post._id, index)}>
                  Like
                  <span className="material-symbols-outlined"> favorite </span>
                </button> }

                <button onClick={() => handleCommentInput(post)}>
                <span id='comment-logo' className="material-symbols-outlined"> mode_comment </span> Comment</button>
              </div>
                  
              {post.comments.length > 3 && 
              <button className='see-all-comments' onClick={() => setShownCommentNumber(-post.comments.length)}>
                See all comments
              </button>}
                
                {/* limit number of shown comments to 2 as default*/}
              {post.comments.slice(shownCommentNumber).map((comment, index) => (
                
                <div className='comment-container' key={index}>

                  <img className='comment-profile-pic' src={comment.userId.profile_pic} alt="" />

                  <div>
                    <div className='comment-info-container'>
                      <div className='single-comment-header'>
                        <h3 onClick={() => handleProfilePage(comment.userId, navigate)} className='comment-username'>
                          {comment.username}
                        </h3>
                        <p className='comment-date'>{formatDistanceToNow(comment.date)} ago</p>
                      </div>
                      {commentEdit && editedComment._id == comment._id ?
                      <div>
                        <textarea value={editedCommentText} onChange= {(e) => setEditedCommentText(e.target.value)}></textarea>
                        <button onClick={() => handleCommentEditSubmit(post, comment)}>Save</button>
                      </div> : 
                      <p>{comment.text}</p>} 
                    </div>

                    <div className='comment-like-edit-delete-container'>
                        <button className='comment-like-btn'>
                          Like
                          <span className="material-symbols-outlined"> favorite </span>
                        </button>
                        {comment.email == user.email ?
                        <div className='comment-edit-delete-container'>
                          <button onClick={() => {handleCommentEdit(comment)}}>Edit</button>
                          <button onClick={() => handleCommentDelete(post._id, comment._id)}>Delete</button>
                        </div> : <p></p>}
                      </div>
                  </div>

                </div>
                ))}

              {post.showCommentInput &&
              <div className='comment-send-container'>  
                <input type="text" placeholder='Write a comment...' value={commentText} onChange= {(e) => setCommentText(e.target.value)}/>
                <button onClick={() => handleCommentPost(post._id)}
                  className={commentText.trim() == "" ? 'disabled-comment-postBtn' : 'comment-post-btn'}
                >Post</button>
              </div>}
            </div>

          </div>
        ))  : <PostsSkeleton />}
      </div>
    </div>
  )
};

export default Post;
