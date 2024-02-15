/* eslint-disable react/prop-types */
import './Navbar.css'
import '../main.css'
import AuthService from '../Authentication/AuthService';
import { useNavigate } from 'react-router-dom';
import FriendRequests from '../FriendRequests/FriendRequests';
import { useState } from 'react';
import { handleProfilePage } from '../Profiles/Profile';
import defaultProfilePic from '../images/default-profile.svg'

function Navbar ({user}) {
  const [showRequests, setShowRequests] = useState(false)
  const navigate = useNavigate();
  const windowWidth = window.innerWidth;
  console.log(windowWidth)

  function handleLogOut() {
    AuthService.logout();
    navigate('/');
  }

  function showFriendRequests() {
    setShowRequests(!showRequests);
  }

  return (
    <div className='navbar-container'>

      <button className='navbar-logo' onClick={() =>{
        navigate('/homepage')}}>friendSync
      </button>

      <div className='right-side'>
        <div className='navbar-profile-info-container'>
          <img onClick={() => handleProfilePage(user._id, navigate)} src={user.profile_pic ? user.profile_pic : defaultProfilePic} className='navbar-profile-pic' />
          {windowWidth > 821 && <button className='navbar-username-btn' onClick={() => handleProfilePage(user._id, navigate)}>{user.firstName + ' ' + user.lastName}</button>}
        </div>

        <div> 
          <button className='friends-icon-btn'>
            <span id='friends-icon' onClick={showFriendRequests} className="material-symbols-outlined">
              group
            </span>
          </button>
          {showRequests && <div className='friend-requests-list'> <FriendRequests /> </div>}
        </div>

        {windowWidth > 821 ? 
        <div className='settings-log-out-buttons-container'>
          <button>
            <span className="material-symbols-outlined settings-icon">
            settings
            </span>
          </button>

          <button onClick={handleLogOut}>
            <span className="material-symbols-outlined log-out-icon">
              logout
            </span>
          </button>
        </div> :

        <div className='menu-container'>
          <button>
            <span className="material-symbols-outlined"> menu</span>
          </button>
        </div>}

      </div>

    </div>
  )
}

export default Navbar;