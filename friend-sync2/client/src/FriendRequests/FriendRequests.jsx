import { useEffect, useState } from 'react'
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import AuthService from '../Authentication/AuthService';
import { handleProfilePage } from '../Profiles/Profile';
import { useNavigate } from 'react-router-dom';

function FriendRequests() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([])
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
            `${API_BASE}/friends/requests`,
            {
              user,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          setRequests(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getFriendRequests();
  }, [user]); // Dependency on user, so it runs when user changes

  return(
    <div>
      {requests.map((request, key) => (
        <button onClick={() => handleProfilePage(request.userId, navigate)} key={key}>{request.fullName}</button>
      ))}
    </div>
  )
}

export default FriendRequests;