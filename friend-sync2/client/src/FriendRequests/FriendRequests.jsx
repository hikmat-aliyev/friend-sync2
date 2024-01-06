import { useEffect, useState } from 'react'
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import AuthService from '../Authentication/AuthService';
import { handleProfilePage } from '../Profiles/Profile';
import { useNavigate } from 'react-router-dom';

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
    <div>
      {receivedRequests.map((request, key) => (
        <div key={key}>
           <button onClick={() => handleProfilePage(request.userId, navigate)}>{request.fullName}</button>
           <button>
            <span className="material-symbols-outlined">
                notifications
              </span>
           </button>
        </div>    
      ))}
    </div>
  )
}

export default FriendRequests;