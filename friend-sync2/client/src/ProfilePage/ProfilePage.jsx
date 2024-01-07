import Navbar from '../Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import Post from '../Post/Post';
import {useState, useEffect, useCallback} from 'react'
import AuthService from '../Authentication/AuthService';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import Friends from '../Friends/Friends';
import ProfilePictureUpload from '../ProfilePic/ProfilePic';

const ProfilePage = () => {
  const location = useLocation();
  const profile = location.state && location.state.profile;   
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSend, setRequestSend] = useState(true);
  const [requestReceived, setRequestReceived] = useState(null);
  const [requestAccepted, setRequestAccepted] = useState(null);
  const [isFriend, setIsFriend] = useState(null);

  const haveRequestSended = useCallback(async () => {
    if(user){
      try {
        const response = await axios.post(`${API_BASE}/profiles/check/request`, {
          user,
          profile,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setRequestSend(response.data.isRequestSent);
        setRequestReceived(response.data.isRequestReceived);
      } catch (err) {
        console.log(err);
      }
    }
  }, [user, profile]);

  const handleIsFriend = useCallback(async () => {
    if(user){
      try {
        const response = await axios.post(`${API_BASE}/profiles/check/friend`, {
          user,
          profile,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setIsFriend(response.data)
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
      handleIsFriend();
    }
  }, [user, haveRequestSended, handleIsFriend]);



  async function handleAddFriend(profile) {
    try{
      
      await axios.post(`${API_BASE}/profiles/add`, {
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
     await axios.post(`${API_BASE}/profiles/cancel/request`, {
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

  async function handleAcceptRequest(profile) {
    try{
      const response = await axios.post(`${API_BASE}/profiles/accept/request`, {
        user, profile
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      setRequestAccepted(response.data);
      setIsFriend(response.data)
    }catch(err){
      console.log(err)
    }
  } 

  async function handleRemoveRequest(profile) {
    try{
      const response = await axios.post(`${API_BASE}/profiles/remove/request`, {
        user, profile
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      //set like this to show Add friend button
     setRequestSend(!response.data)
     setRequestReceived(!response.data)
    }catch(err){
      console.log(err)
    }
  } 

  async function handleRemoveFriend(profile) {
    try{
      const response = await axios.post(`${API_BASE}/profiles/remove/friend`, {
        user, profile
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      //reset requests
      setRequestAccepted(!response.data);
      setRequestSend(!response.data);
      setRequestReceived(!response.data);
      setIsFriend(false);
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
          <Navbar user={user}/>
        </div>
        <div>
          <div> 
            {/* show profile picture change only for main user */}
            {user._id == profile._id && <div>
              <ProfilePictureUpload user={user}/>
            </div>}

            <h1>{profile.first_name + ' ' + profile.last_name}</h1>

            <div>  
              {!isFriend && !requestSend && !requestReceived && 
              <button onClick={() => handleAddFriend(profile)}>Add friend</button>}

                {!requestSend && requestReceived && !requestAccepted &&
                <div>
                  <button onClick={() => handleAcceptRequest(profile)}>Accept request</button>
                  <button onClick={() => handleRemoveRequest(profile)}>Remove request</button>
                </div>}

              {requestSend && !requestReceived && <button onClick={() => handleCancelRequest(profile)}>Cancel request</button>}
              {(requestAccepted || isFriend) && <button onClick={() => handleRemoveFriend(profile)}>Friends</button>}
            </div>

          </div>
          <Post userInfo={user} profileInfo={profile}/>
          <Friends user={profile}/>
        </div>
      </div>
    ) : (
      <p>User not found</p>
    )}
  </div>
  );
};

  export default ProfilePage;
