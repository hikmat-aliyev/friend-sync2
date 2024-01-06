import axios from "axios";
import { useEffect, useState } from "react";
const API_BASE = 'http://localhost:3000'
import { useNavigate } from 'react-router-dom';
import { handleProfilePage } from '../Profiles/Profile';

/* eslint-disable react/prop-types */
function Friends({user}) {
  const [friends, setFriends] = useState(null);
  const navigate = useNavigate();

  useEffect( () => {
   async function fetchData(){
    try{
      const response = await axios.post(`${API_BASE}/find/friends`, {
        user
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data);
      setFriends(response.data)
    }catch(err){
      console.log(err)
    }
   }

   fetchData()
  }, [user])

  return(
    <div>
      {friends && friends.map((friend, index) => ( 
        <div key={index}>
          <div>
            <h1>Friends</h1>
            <p>{friends.length} friend</p>
          </div>
            
          <h3 onClick={() => handleProfilePage(friend.profileId, navigate)}>
            {friend.fullName}
          </h3>
        </div>))}
    </div>
  )
}

export default Friends;