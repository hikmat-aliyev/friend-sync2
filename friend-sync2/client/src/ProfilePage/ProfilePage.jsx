import Navbar from '../Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import Post from '../Post/Post';
import {useState, useEffect, useCallback} from 'react'
import AuthService from '../Authentication/AuthService';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'

const ProfilePage = () => {
  const location = useLocation();
  const profile = location.state && location.state.profile;   
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSend, setRequestSend] = useState(true);

  const haveRequestSended = useCallback(async () => {
    if(user){
      try {
        const response = await axios.post(`${API_BASE}/friends/check/request`, {
          user,
          profile,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setRequestSend(response.data)
      } catch (err) {
        console.log(err);
      }
    }
  }, [user, profile]);

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

  useEffect(() => {
    if (user) {
      haveRequestSended(); // Call haveRequestSended() here
    }
  }, [user, haveRequestSended]);



  async function handleAddFriend(profile) {
    try{
      
      await axios.post(`${API_BASE}/friends/add`, {
        user, profile
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      setRequestSend(true)
    }catch(err){
      console.log(err)
    }
  } 

  async function handleCancelRequest(profile) {
    try{
     await axios.post(`${API_BASE}/friends/cancel/request`, {
        user, profile
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      setRequestSend(false)
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
          <Navbar />
        </div>
        <div>
          <div> 
            <h1>{profile.first_name + ' ' + profile.last_name}</h1>

          {profile._id != user._id && <div>
            {requestSend == false ? 
              <button onClick={() => handleAddFriend(profile)}>Add friend</button> :
              <button onClick={() => handleCancelRequest(profile)}>Cancel request</button>}
           </div>}

          </div>
          <Post userInfo={user} profileInfo={profile}/>
        </div>
      </div>
    ) : (
      <p>User not found</p>
    )}
  </div>
  );
};

  export default ProfilePage;
