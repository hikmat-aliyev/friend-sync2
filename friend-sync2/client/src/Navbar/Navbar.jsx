/* eslint-disable react/prop-types */
import './Navbar.css'
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
        navigate('/homepage')}}>FriendSync</button>
      <div className='right-side'>
        <img src="" alt="" />
        <button onClick={() => handleProfilePage(user._id, navigate)}>{user.firstName + ' ' + user.lastName}</button>
        <div> 
           <button onClick={showFriendRequests}>
              <span className="material-symbols-outlined">
                notifications
              </span>
           </button>
           {showRequests && <div className='friend-requests-list'> <FriendRequests /> </div>}
        </div>
        <button>Settings</button>
        <button onClick={handleLogOut}>
        <span className="material-symbols-outlined log-out-logo">
          logout
        </span>
        </button>
      </div>
    </div>
  )
}

export default Navbar;