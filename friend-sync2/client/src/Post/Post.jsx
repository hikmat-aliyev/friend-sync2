import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import './Post.css'
import { formatDistanceToNow } from 'date-fns';
import postLogo from '../images/sendLogo.svg';
import { useNavigate } from 'react-router-dom';
import { handleProfilePage } from '../Profiles/Profile';
import { convertToBase64 } from '../Picture/Picture';
// import HeartButton from '../HeartButton/HeartBtn';

// eslint-disable-next-line react/prop-types
const Post = ({userInfo, profileInfo}) => {
  const [posts, setPosts] = useState(null);
  const [post, setPost] = useState('');
  const user = userInfo;
  // set postOwner to profile data if we are in friend page
  const postOwner = profileInfo ? profileInfo : userInfo;
  const [commentInputToggle, setToggle] = useState(false);
  const [commentText, setCommentText] = useState(" ");
  const [showLikeList, setShowLikeList] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [showCommentList, setShowCommentList] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();

  //get all posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_BASE}/post/get-posts`, {
          postOwner
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchData();
  }, [postOwner]);

  async function handlePostSubmit(e) {
      e.preventDefault();
      try{
        const response = await axios.post(`${API_BASE}/post/submit`, {
          post, user, postImage
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })

        const data = response.data;
        setPosts(data);
        setPost('');
        setPostImage(null)
      }catch(err){
        console.log(err)
      }
      
  }

  async function handlePostDelete (postId) {
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

  async function handlePostLike (postId) {
    try{
      const response = await axios.post(`${API_BASE}/post/like`, {
        postId, user, postOwner
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

  async function handlePostUnlike (postId) {
    try{
      const response = await axios.post(`${API_BASE}/post/unlike`, {
        postId, postOwner, user
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

  function handleCommentList() {
    setShowCommentList(true)
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

  return (
    <div className='post-container'>
      {!profileInfo && 
      <div className='create-post-container'>
        <form onSubmit={handlePostSubmit}>
          <textarea type="text" placeholder="What's on your mind?" 
          value={post} onChange= {(e) => setPost(e.target.value)}/>
        </form>

         <div className='post-create-image-container'>

         {postImage && <span onClick={() => setPostImage(null)} className="material-symbols-outlined">close</span>}

          <img src={postImage} className='post-create-image'/>

        </div> 
        <input ref={imageInputRef} type='file' label ='Image' name='post_picture' id='post-pic-upload'
            accept='.jpeg, .png, .jpg' onChange={(e) => handleFileUpload(e)}/>

        <div className='upload-and-image-button-container'>
          <label htmlFor="post-pic-upload">
            <span className="material-symbols-outlined">
            image
            </span>
          </label>

          <button onClick={handlePostSubmit} className={post.trim() == "" ? 'disabled-postBtn' : 'postBtn'}  type='submit'>
            <img className='postLogo .material-symbols-outlined' src={postLogo} />
          </button>
        </div>

      </div>}

      {posts && posts.map((post, index) => (
        <div className='single-post-container' key={index}>

          <div className='post-header'>
            <div>
              <h2>{post.username}</h2>
              <p>posted {formatDistanceToNow(post.date, {addSuffix: true})}</p>
            </div>
            {/* show delete btn if we are not in friend's page */}
            {!profileInfo ? <button className='post-delete-button' onClick={() => handlePostDelete(post._id)}>
            <span id='delete-logo' className="material-symbols-outlined"> delete </span>
              </button> : null}
          </div>

          <p className='post-text'>{post.text}</p>
          <img className='single-post-picture' src={post.post_picture}/>

          <div className='like-comment-list-container'>
            { post.like_number > 0 ? 
            <button onClick={() => handleLikeList(post)}>
              {post.like_number} {post.like_number ==1 ? 'like' : 'likes'}
            </button> : <p></p>}
              
            { post.comment_number > 0 ? 
            <button className='comment-number' onClick={() => handleCommentList(post)}>
              {post.comment_number} {post.comment_number == 1 ? 'comment' : 'comments'}
            </button> : <p></p>}
          </div>

          {showLikeList && <div className='list-of-likes'>
            {likeList.length > 0 ? likeList.map((like, index) => (
              <p key={index} 
                onClick={() => {
                  handleProfilePage(like.userId, navigate)
                  setShowLikeList(false)
                  }}>
                {like.username}
                </p>
            )) : <p key={index}>no likes</p>}
          </div>} 

          {showCommentList && <div className='list-of-comments'>
            {post.comments.length > 0 ? post.comments.map((comment, index) => (
              <div key={index}>
                <h3 onClick={() => {handleProfilePage(comment.userId, navigate)
                                    setShowCommentList(false)}}>
                  {comment.username}
                </h3>
                {/* show delete btn if the comment belongs to the current user */}
                {comment.email == user.email ? 
                <button onClick={() => {handleCommentDelete(post._id, comment._id)}}>
                    Delete
                </button> : null}
                <p>posted {formatDistanceToNow(comment.date, {addSuffix: true})}</p>
                <p>{comment.text}</p>
              </div>
            )) : <p key={index}>No comments</p>}
          </div>} 

          <div>
            <div className='like-comment-btn-container'>
              {isPostLiked(post.likes) ? 
              <button onClick={() => handlePostUnlike(post._id)} className='liked-button'>
                 <span id='like-logo' className="material-symbols-outlined"> thumb_up </span>
                   Like
              </button> : <button  onClick={() => handlePostLike(post._id)}>
                 <span className="material-symbols-outlined"> thumb_up </span>
                 Like
              </button> }

              {/* {isPostLiked(post.likes) ? 
              <button onClick={() => handlePostUnlike(post._id)}>
                 <HeartButton isLiked={true}/>
              </button> : <button  onClick={() => handlePostLike(post._id)}>
                             <HeartButton isLiked={false}/>
                          </button> } */}

              <button onClick={() => handleCommentInput(post)}>
              <span id='comment-logo' className="material-symbols-outlined"> mode_comment </span> Comment</button>
            </div>
                
            {post.comments.length > 3 && <button className='see-all-comments' onClick={() => handleCommentList(post)}>
              See all comments</button>}
              
              {/* limit number of shown comments to 3 */}
            {post.comments.slice(-3).map((comment, id) => (
                <div className='comment-container' key={id}>
                  <div className='single-comment-header'>
                    <h3 onClick={() => handleProfilePage(comment.userId, navigate)} className='comment-username'>
                      {comment.username}
                    </h3>
                     {/* show delete btn if the comment belongs to the current user */}
                     {comment.email == user.email ? <button 
                      onClick={() => handleCommentDelete(post._id, comment._id)}>
                        <span className="material-symbols-outlined"> delete </span>
                      </button> : null}
                  </div>
                  <p className='comment-date'>{formatDistanceToNow(comment.date)} ago</p>
                  <p>{comment.text}</p>
                </div>
              ))}

            {post.showCommentInput &&
            <div> 
              <input type="text" placeholder='Write a comment...' value={commentText} onChange= {(e) => setCommentText(e.target.value)}/>
              <button onClick={() => handleCommentPost(post._id)}
                className={commentText.trim() == "" ? 'disabled-postBtn' : ''}
              >Post</button>
            </div>}
          </div>

        </div>
      ))}
</div>
  )
};

export default Post;
