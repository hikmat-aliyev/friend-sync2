import axios from 'axios'
import { API_BASE } from '../Authentication/AuthService';
  
  //function for navigating to comment owner profile page
  export async function handleProfilePage(profileId, navigate) {
    try{
      //getting profile from backend based on profileId that we get from properties of comment
      const response = await axios.post(`${API_BASE}/find/owner`, {
        profileId
      },{
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const profile = response.data;
      //navigate to proper profile homepage by passing proper arguments
      navigate('/profile-homepage', { state: { profile: profile } });
    }catch(err){
      console.log(err)
    }
  }