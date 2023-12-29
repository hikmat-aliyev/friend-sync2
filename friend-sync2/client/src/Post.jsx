import { useEffect, useState } from 'react';
import AuthService from './Authentication/AuthService';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'

// eslint-disable-next-line react/prop-types
const Post = ({userInfo}) => {
  const [posts, setPosts] = useState(null);
  const [post, setPost] = useState('');
  const [error, setError] = useState(null);
  const [user, setUserInfo] = useState(userInfo)

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
          <p>{post.text}</p>
        </div>
      ))}
</div>
  )
};

export default Post;
