import './Navbar.css'
import AuthService from '../Authentication/AuthService';
import { useNavigate } from 'react-router-dom';

function Navbar () {
  const navigate = useNavigate();

  function handleLogOut() {
    AuthService.logout();
    navigate('/');
  }

  return (
    <div className='navbar-container'>
      <button>FriendSync</button>
      <div className='right-side'>
        <img src="" alt="" />
        <button>username</button>
        <button>friend requests</button>
        <button>Settings</button>
        <button onClick={handleLogOut}>Log out</button>
      </div>
    </div>
  )
}

export default Navbar;