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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showMenu, setShowMenu] = useState(false);

  function handleLogOut() {
    AuthService.logout();
    navigate('/');
  }

  function showFriendRequests() {
    setShowRequests(!showRequests);
  }

   function handleSettingsPage() {
    navigate('/settings', { state: { user } }); // Pass the user data via location state
  }

  return (
    <div className='navbar-container'>

      <button className='navbar-logo' onClick={() =>{
        navigate('/homepage')}}>friendSync
      </button>

      <div className='right-side'>
        <div className='navbar-profile-info-container'>
          <img onClick={() => handleProfilePage(user._id, navigate)} src={user.profile_pic ? user.profile_pic : defaultProfilePic} className='navbar-profile-pic' />
          {windowWidth > 831 && <button className='navbar-username-btn' onClick={() => handleProfilePage(user._id, navigate)}>{user.firstName + ' ' + user.lastName}</button>}
        </div>

        <div> 
          <button className='friends-icon-btn'>
            <span id='friends-icon' onClick={showFriendRequests} className="material-symbols-outlined">
              group
            </span>
          </button>
          {showRequests && <div className='friend-requests-list'> <FriendRequests /> </div>}
        </div>

        {windowWidth > 831 ? 
        <div className='settings-log-out-buttons-container'>
          <button onClick={handleSettingsPage}>
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
          <button onClick={() => {setShowMenu(!showMenu)}}>
            <span className="material-symbols-outlined"> menu</span>
          </button>
          {showMenu &&
            <div className='settings-log-out-container'>
              <button onClick={handleSettingsPage}>Settings</button>
              <button onClick={handleLogOut}>Log out</button>
            </div>
          }
        </div>}

      </div>

    </div>
  )
}

export default Navbar;