import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import './Post.css'
import { formatDistanceToNow } from 'date-fns';
import deleteLogo from '../images/deleteLogo.svg';
import postLogo from '../images/sendLogo.svg';

// eslint-disable-next-line react/prop-types
const Post = ({userInfo}) => {
  const [posts, setPosts] = useState(null);
  const [post, setPost] = useState('');
  const [user, setUserInfo] = useState(userInfo);
  const [commentInputToggle, setToggle] = useState(false);
  const [commentText, setCommentText] = useState(" ");
  const [showLikeList, setShowLikeList] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [showCommentList, setShowCommentList] = useState(false);
  const [commentList, setCommentList] = useState([]);

  //get all posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_BASE}/post/get-posts`, {
          user
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
  }, [user]);

  async function handlePostSubmit(e) {
      e.preventDefault();
      try{
        const response = await axios.post(`${API_BASE}/post/submit`, {
          post, user
        }, {
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

  async function handlePostUnlike (postId) {
    try{
      const response = await axios.post(`${API_BASE}/post/unlike`, {
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

  function isPostLiked(likes) {
    return likes.some(like => like.email == user.email)
  }

  async function handleCommentPost(postId) {
    setCommentText('');
    try{
      const response = await axios.post(`${API_BASE}/post/comment`, {
        postId, user, commentText
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

  function handleCommentList(post) {
    setCommentList(post.comments)
    setShowCommentList(true)
  }

  async function handleCommentDelete(postId, commentId) {
    try{
      const response = await axios.post(`${API_BASE}/post/comment/delete`, {
        postId, user, commentId
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

  return (
    <div className='post-container'>
      <div className='create-post-container'>
        <form onSubmit={handlePostSubmit}>
          <textarea type="text" placeholder="What's on your mind?" 
          value={post} onChange= {(e) => setPost(e.target.value)}/>
          <button className={post.trim() == "" ? 'disabled-postBtn' : 'postBtn'}  type='submit'>
            <img className='postLogo .material-symbols-outlined' src={postLogo} />
          </button>
        </form>
      </div>

      {posts && posts.map((post, index) => (
        <div className='post-container' key={index}>

          <div className='post-header'>
            <div>
              <h2>{post.username}</h2>
              <p>posted {formatDistanceToNow(post.date, {addSuffix: true})}</p>
            </div>
            {/* show delete btn if the post belongs to the current user */}
            {post.user._id == user._id ? <button className='post-delete-button' onClick={() => handlePostDelete(post._id)}>
              <img src={deleteLogo} alt="delete-logo" />
              </button> : null}
          </div>

          <p className='post-text'>{post.text}</p>

          <div className='like-comment-list-container'>
            { post.like_number == 1 ? <button onClick={() => handleLikeList(post)}>{post.like_number} like</button> : null}
            { post.like_number > 1 ? <button onClick={() => handleLikeList(post)}>{post.like_number} likes</button> : null}
            { post.comment_number == 1 ? <button onClick={() => handleCommentList(post)}>{post.comment_number} comment</button> : null}
            { post.comment_number > 1 ? <button onClick={() => handleCommentList(post)}>{post.comment_number} comments</button> : null}
          </div>

          {showLikeList && <div className='list-of-likes'>
            {likeList.length > 0 ? likeList.map((like, index) => (
              <p key={index}>{like.username}</p>
            )) : <p key={index}>no likes</p>}
          </div>} 

          {showCommentList && <div className='list-of-comments'>
            {commentList.length > 0 ? commentList.map((comment, index) => (
              <div key={index}>
                <h3>{comment.username}</h3>
                <p>posted {formatDistanceToNow(comment.date, {addSuffix: true})}</p>
                <p>{comment.text}</p>
              </div>
            )) : <p key={index}>no comments</p>}
          </div>} 

            
          <div>
            {isPostLiked(post.likes) ? 
            <button onClick={() => handlePostUnlike(post._id)} className='liked-button'>Like</button> : 
            <button  onClick={() => handlePostLike(post._id)}>Like</button>}

            <button onClick={() => handleCommentInput(post)}>Comment</button>

            <button className='see-all-comments' onClick={() => handleCommentList(post)}>See all comments</button>
              
              {/* limit number of shown comments to 3 */}
            {post.comments.slice(-3).map((comment, id) => (
                <div key={id}>
                  <h3>{comment.username}</h3>
                  <p>posted {formatDistanceToNow(comment.date, {addSuffix: true})}</p>
                  <p>{comment.text}</p>
                  {/* show delete btn if the comment belongs to the current user */}
                  {comment.email == user.email ? <button 
                  onClick={() => handleCommentDelete(post._id, comment._id)}>Delete</button> : null}
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
