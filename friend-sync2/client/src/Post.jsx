import { useEffect, useState, useSyncExternalStore } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import './Post.css'
import { formatDistanceToNow } from 'date-fns';
// eslint-disable-next-line react/prop-types
const Post = ({userInfo}) => {
  const [posts, setPosts] = useState(null);
  const [post, setPost] = useState('');
  const [error, setError] = useState(null);
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
      const trimmedText = post.trim();
      if(!post || trimmedText == ''){
        setError('Your post can not be empty')
        return
      }
      else if(post.length > 200){
        setError('Post should not be longer than 200 characters')
        return
      }
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

  return (
    <div>
      <div className='createPost'>
        <form onSubmit={handlePostSubmit}>
          <input type="text" placeholder="What's on your mind" 
          value={post} onChange= {(e) => setPost(e.target.value)}/>
          <button type='submit'>Share</button>
          {error && <p>{error}</p>}
        </form>
      </div>

      {posts && posts.map((post, index) => (
        <div key={index}>

          <div className='post-header'>
            <h1>{post.username}</h1>
            <p>posted {formatDistanceToNow(post.date, {addSuffix: true})}</p>
            {/* show delete btn if the post belongs to the current user */}
            {post.user._id == user._id ? <button onClick={() => handlePostDelete(post._id)}>Delete</button> : null}
          </div>

          <p>{post.text}</p>

          <div>
            <button onClick={() => handleLikeList(post)}>{post.like_number} likes</button>
            <button onClick={() => handleCommentList(post)}>{post.comment_number} comments</button>
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
                  {comment.email == user.email ? <button>Delete</button> : null}
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
