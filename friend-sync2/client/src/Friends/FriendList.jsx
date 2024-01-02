import { useState, useEffect } from 'react'
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import './Friend.css'
import { useNavigate } from 'react-router-dom';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  function handleFriendPage(friendId) {
    navigate('/friend-homepage', { state: { id: friendId } });
  }

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

  return (
   <div>
    <h1>New users</h1>
    {friends.length > 0 && 
    <div className='friends-list'>{friends.map((friend, key) => 
      <button onClick={() => handleFriendPage(friend.id)} key={key}>{friend.fullName}</button>)} </div>}
   </div> 
  );
};

export default FriendList;
