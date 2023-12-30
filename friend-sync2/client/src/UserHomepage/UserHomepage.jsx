import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Authentication/AuthService';
import Post from '../Post/Post'

const UserHomepage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
