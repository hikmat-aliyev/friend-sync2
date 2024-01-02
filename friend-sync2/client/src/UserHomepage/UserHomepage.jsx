import { useEffect, useState } from 'react';
import AuthService from '../Authentication/AuthService';
import Post from '../Post/Post';
import Navbar from '../Navbar/Navbar';
import './UserHomepage.css'
import FriendList from "../Friends/FriendList";

const UserHomepage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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


  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div className='user-homepage'>
          <div>
            <Navbar/>
          </div>
          <div>
            <Post userInfo={user}/>
          </div>
          <div>
            <FriendList />
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserHomepage;
