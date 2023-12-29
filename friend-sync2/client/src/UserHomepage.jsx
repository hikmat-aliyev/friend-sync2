import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './Authentication/AuthService';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import Post from './Post';

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

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <h1>Welcome, {user.firstName} {user.lastName}!</h1>
          <button onClick={handleLogOut}>Log out</button>
          <Post userInfo={user}/>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserHomepage;
