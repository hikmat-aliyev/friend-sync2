import { useEffect, useState } from 'react';
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
  console.log(posts)
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

  async function handlePostLike () {

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
            <p>{formatDistanceToNow(post.date, {addSuffix: true})}</p>
            <button onClick={() => handlePostDelete(post._id)}>Delete</button>
          </div>

          <p>{post.text}</p>

          <div>
            <a href="">likes</a>
            <a href="">comments</a>
          </div>

            
          <div>
            <button>Like</button>
            <button>Comment</button>
          </div>
        </div>
      ))}
</div>
  )
};

export default Post;
