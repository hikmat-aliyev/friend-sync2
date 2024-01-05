import { useState, useEffect } from 'react'
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import './ProfilesList.css'
import { useNavigate } from 'react-router-dom';
import { handleProfilePage } from '../Profiles/Profile';

const ProfileList = (user) => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_BASE}/friends`,{
             user
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setProfiles(response.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchData();
  }, [user]);

  return (
   <div>
    <h1>New users</h1>
    {profiles.length > 0 && 
    <div className='friends-list'>{profiles.map((profile, key) => 
      <button onClick={() => handleProfilePage(profile._id, navigate)} key={key}>{profile.first_name + ' ' + profile.last_name}</button>)} </div>}
   </div> 
  );
};

export default ProfileList;
