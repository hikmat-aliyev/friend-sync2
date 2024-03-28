  import { useEffect, useState } from 'react';
  import AuthService from '../Authentication/AuthService';
  import Post from '../Post/Post';
  import Navbar from '../Navbar/Navbar';
  import './UserHomepage.css'
  import ProfilesList from "../Profiles/ProfilesList";

  const UserHomepage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
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
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, []);


    return (
      <div>
        {loading ? (
          <p className='loading-text'>Loading...</p>
        ) : user ? (
          <div className='user-homepage'>
            <div className='navbar-section'>
              <Navbar user={user}/>
            </div>
            <div className='post-section'>
              <Post userInfo={user} path={'homepage'}/>
            </div>
            <div className='profiles-list-section'>
              <ProfilesList user={user}/>
            </div>
          </div>
        ) : (
          <p>User not found</p>
        )}
      </div>
    );
  };

  export default UserHomepage;
