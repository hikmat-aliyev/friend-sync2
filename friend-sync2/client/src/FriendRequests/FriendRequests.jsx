import { useEffect, useState } from 'react'
import axios from 'axios';
import { API_BASE } from '../Authentication/AuthService';
import AuthService from '../Authentication/AuthService';
import { handleProfilePage } from '../Profiles/Profile';
import { useNavigate } from 'react-router-dom';
import './FriendRequests.css'

function FriendRequests() {
  const [user, setUser] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([])
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
    }
  }, []);

  useEffect(() => {
    async function getFriendRequests() {
      try {
        if (user) {
          const response = await axios.post(
            `${API_BASE}/profiles/requests`,
            {
              user,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          setReceivedRequests(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getFriendRequests();
  }, [user]); // Dependency on user, so it runs when user changes

  return(
    <div className='friend-requests-container'>
      {receivedRequests.map((request, key) => (
        <div key={key}>
           <button onClick={() => handleProfilePage(request.userId, navigate)}>{request.fullName}</button>
        </div>    
      ))}
    </div>
  )
}

export default FriendRequests;