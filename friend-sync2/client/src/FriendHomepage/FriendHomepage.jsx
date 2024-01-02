import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
const API_BASE = 'http://localhost:3000';
import Post from '../Post/Post';

const FriendHomepage = () => {
  const location = useLocation();
  const userId = location.state && location.state.id;
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${API_BASE}/user/info`, {
          userId
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData()
  }, [userId]);


  return (
    <div>
      <Navbar />
      {/* <Post userInfo={user}/> */}
    </div>
  );
};

export default FriendHomepage;
