import { useState, useEffect } from 'react'
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import './ProfilesList.css'
import { useNavigate } from 'react-router-dom';
import { handleProfilePage } from '../Profiles/Profile';

// eslint-disable-next-line react/prop-types
const ProfileList = ({user}) => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_BASE}/profiles`,{
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

      <div className='profiles-list'>
        {profiles.map((profile, key) => 
        <div key={key}>
          <img src={profile.profile_pic}/>
          <button onClick={() => handleProfilePage(profile._id, navigate)}>{
          profile.first_name + ' ' + profile.last_name}
          </button>
        </div>
        )}
      </div>}

   </div> 
  );
};

export default ProfileList;
