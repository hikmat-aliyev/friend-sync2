import { useState, useEffect } from 'react'
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import './ProfilesList.css'
import { useNavigate } from 'react-router-dom';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_BASE}/friends`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setFriends(response.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchData();
  }, []);


  function handleFriendPage(friend) {
    navigate('/friend-homepage', { state: { friend: friend } });
  }

  return (
   <div>
    <h1>New users</h1>
    {friends.length > 0 && 
    <div className='friends-list'>{friends.map((friend, key) => 
      <button onClick={() => handleFriendPage(friend)} key={key}>{friend.fullName}</button>)} </div>}
   </div> 
  );
};

export default FriendList;
