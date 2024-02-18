import Navbar from '../Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import Post from '../Post/Post';
import './ProfilePage.css'
import {useState, useEffect, useCallback} from 'react'
import AuthService from '../Authentication/AuthService';
import axios from 'axios';
import { API_BASE } from '../Authentication/AuthService';
import Friends from '../Friends/Friends';
import ProfilePictureUpload from '../Picture/ProfilePic';

const ProfilePage = () => {
  const location = useLocation();
  const profile = location.state && location.state.profile;   
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSend, setRequestSend] = useState(true);
  const [requestReceived, setRequestReceived] = useState(null);
  const [requestAccepted, setRequestAccepted] = useState(null);
  const [isFriend, setIsFriend] = useState(null);
  const [backgroundShadow, setBackgroundShadow] = useState(null);

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
    <div className='total-profile-page'>
    {loading ? (
      <p>Loading...</p>
    ) : user ? (
      <div className='profile-page'>

        {backgroundShadow && <div className='background-shadow'></div>}

        <div className='profile-page-navbar'>
          <Navbar user={user}/>
        </div>
        
        <div className='profile-header-container'>
          
          <div className='profile-pic-username-container'>
            <ProfilePictureUpload user={user} profile={profile} setBackgroundShadow={setBackgroundShadow}/>
            <div>
              <h1>{profile.first_name + ' ' + profile.last_name}</h1>
              <h3>{profile.friends.length} friends</h3>
            </div>
          </div>

          {user._id !== profile._id ? 
          <div className='profile-is-friend-container'>  
            {!isFriend && !requestSend && !requestReceived && 
            <button onClick={() => handleAddFriend(profile)}>Add friend</button>}

            {!requestSend && requestReceived && !requestAccepted &&
            <div className='add-cancel-friend-btn-container'>
              <button onClick={() => handleAcceptRequest(profile)}>Accept request</button>
              <button onClick={() => handleRemoveRequest(profile)}>Remove request</button>
            </div>}

            {requestSend && !requestReceived && <button onClick={() => handleCancelRequest(profile)}>Cancel request</button>}
            {(requestAccepted || isFriend) && <button onClick={() => handleRemoveFriend(profile)}>Friends</button>}
          </div> : <p></p>}
        </div>

        <div className='profile-posts-container'>
          <Post userInfo={user} profileInfo={profile} path={'profile-homepage'}/>
        </div>   

        <div className='profile-aboutMe-friends-container'>
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
