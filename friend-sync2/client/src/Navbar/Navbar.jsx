/* eslint-disable react/prop-types */
import { useEffect } from 'react';
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
  const [bgColor, setBgColor] = useState('black');
  const [bodyBgColor, setBodyBgColor] = useState('black');
  const [mainColor,setMainColor] = useState('white');

  function handleColorChange() {
    bgColor == 'black' ? setBgColor('white') : setBgColor('black');
    bodyBgColor == 'black' ? setBodyBgColor('#ebebeb') : setBodyBgColor('black');
    mainColor == 'white' ? setMainColor('rgb(68, 71, 103)') : setMainColor('white');
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--background-color', bgColor);
    document.documentElement.style.setProperty('--body-background-color', bodyBgColor);
    document.documentElement.style.setProperty('--main-color', mainColor)
  }, [bgColor, bodyBgColor, mainColor]);

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

        <button className='change-color' onClick={handleColorChange}>
          {bgColor =='white' && <span className="material-symbols-outlined">
            light_mode
          </span>}
          {bgColor =='black' && <span className="material-symbols-outlined">
            dark_mode
          </span>}
        </button>

        {windowWidth > 831 ? 
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
          <button onClick={() => {setShowMenu(!showMenu)}}>
            <span className="material-symbols-outlined"> menu</span>
          </button>
          {showMenu &&
            <div className='settings-log-out-container'>
              <button onClick={handleLogOut}>Log out</button>
            </div>
          }
        </div>}


      </div>

    </div>
  )
}

export default Navbar;