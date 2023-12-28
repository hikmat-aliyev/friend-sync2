import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './Authentication/AuthService';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'

const UserHomepage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [post, setPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = AuthService.getToken();
    if (jwt) {
      AuthService.getUserInfo(jwt)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  function handleLogOut() {
    AuthService.logout();
    navigate('/');
  }

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
        console.log(data)
        setPosts(data);
      }catch(err){
        console.log(err)
      }
      
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>

          <h1>Welcome, {user.firstName} {user.lastName}!</h1>
          <button onClick={handleLogOut}>Log out</button>

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
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserHomepage;
