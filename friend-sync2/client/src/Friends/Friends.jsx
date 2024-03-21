import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE } from "../Authentication/AuthService";
import { useNavigate } from 'react-router-dom';
import { handleProfilePage } from '../Profiles/Profile';
import './Friends.css'

/* eslint-disable react/prop-types */
function Friends({user}) {
  const [friends, setFriends] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)

  useEffect( () => {
   async function fetchData(){
    try{
      setLoading(true)
      const response = await axios.post(`${API_BASE}/find/friends`, {
        user
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setFriends(response.data)
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
   }

   fetchData()
  }, [user])

  return(
    <>
      {friends && !loading && <div>
        <div>
          <h1 className="friends-h1">Friends</h1>
          <p>{friends.length} friend</p>
        </div>
        <div className="friends-container">
          {friends && friends.map((friend, index) => ( 
            <div onClick={() => handleProfilePage(friend.profileId, navigate)} className="single-friend-container" key={index}>
                <img className="friend-profile-picture" src={friend.picture} alt="" />
                <h3 className="friend-name">
                  {friend.fullName}
                </h3>
            </div>))}
        </div>
      </div>}
    </>
  )
}

export default Friends;