/* eslint-disable react/prop-types */
import './Navbar.css'
import '../main.css'
import AuthService from '../Authentication/AuthService';
import { useNavigate } from 'react-router-dom';
import FriendRequests from '../FriendRequests/FriendRequests';
import { useState } from 'react';
import { handleProfilePage } from '../Profiles/Profile';

function Navbar ({user}) {
  const [showRequests, setShowRequests] = useState(false)
  const navigate = useNavigate();

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
        <img src="" alt="" />
        <button onClick={() => handleProfilePage(user._id, navigate)}>{user.firstName + ' ' + user.lastName}</button>
        <div> 
          <button className='friends-icon-btn'>
            <span id='friends-icon' onClick={showFriendRequests} className="material-symbols-outlined">
              group
            </span>
          </button>
          {showRequests && <div className='friend-requests-list'> <FriendRequests /> </div>}
        </div>

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

      </div>

    </div>
  )
}

export default Navbar;