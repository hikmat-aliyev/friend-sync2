import { useState, useEffect } from 'react'
import axios from 'axios';
import { API_BASE } from '../Authentication/AuthService';
import './ProfilesList.css'
import { useNavigate } from 'react-router-dom';
import { handleProfilePage } from '../Profiles/Profile';
import defaultProfilePic from '../images/default-profile.svg'

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
   <div className='profile-list-container'>

    <h1>New users</h1>

    {profiles.length > 0 ?

      <div className='profiles-container'>
        {profiles.map((profile, key) => 
        <div className='single-profile-items' key={key}>
          <img src={profile.profile_pic ? profile.profile_pic : defaultProfilePic}/>
          <p onClick={() => handleProfilePage(profile._id, navigate)}>{
          profile.first_name + ' ' + profile.last_name}
          </p>
        </div>
        )}
      </div> : <div className='profile-list-skeleton'>
                <div>
                  <img className='skeleton'/>
                  <p className='skeleton'></p>
                </div>

                <div>
                  <img className='skeleton'/>
                  <p className='skeleton'></p>
                </div>

                <div>
                  <img className='skeleton'/>
                  <p className='skeleton'></p>
                </div>
              </div>}

   </div> 
  );
};

export default ProfileList;
