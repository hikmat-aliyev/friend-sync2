import Navbar from '../Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import Post from '../Post/Post';
import {useState, useEffect} from 'react'
import AuthService from '../Authentication/AuthService';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'

const ProfilePage = () => {
  const location = useLocation();
  const friend = location.state && location.state.friend; 
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

  async function handleAddFriend(friend) {
    try{
      const response = await axios.post(`${API_BASE}/friends/add`, {
        user, friend
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = response.data;
      console.log(data)
    }catch(err){
      console.log(err)
    }
  } 

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
          <div> 
            <h1>{friend.fullName}</h1>
            <button onClick={() => handleAddFriend(friend)}>Add friend</button>
          </div>
          <Post userInfo={user} friendInfo={friend}/>
        </div>
      </div>
    ) : (
      <p>User not found</p>
    )}
  </div>
  );
};

export default ProfilePage;
