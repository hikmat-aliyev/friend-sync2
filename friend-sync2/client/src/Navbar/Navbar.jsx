import './Navbar.css'
import AuthService from '../Authentication/AuthService';
import { useNavigate } from 'react-router-dom';
import FriendRequests from '../FriendRequests/FriendRequests';
import { useState } from 'react';

function Navbar () {
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
      <button>FriendSync</button>
      <div className='right-side'>
        <img src="" alt="" />
        <button>username</button>
        <div> 
           <button onClick={showFriendRequests}>friend requests</button>
           {showRequests && <div className='friend-requests-list'> <FriendRequests /> </div>}
        </div>
        <button>Settings</button>
        <button onClick={handleLogOut}>Log out</button>
      </div>
    </div>
  )
}

export default Navbar;