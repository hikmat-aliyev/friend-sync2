/* eslint-disable react/no-unescaped-entities */
import './Index.css'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../Authentication/AuthService';
import GoogleSignIn from '../Google/GoogleSignIn';

function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("error");
  const navigate = useNavigate();

  //clear jwt
  useEffect(() => {
    const jwt = AuthService.getToken();
    if(jwt) {
      AuthService.removeToken()
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Use await to wait for the login to complete before proceeding
      await AuthService.login(email, password);
      setError(null);
      navigate('/homepage')

    } catch (error) {
      setError('Incorrect email or password')
      console.error('Login failed:', error.message);
      // Handle login failure, show an error message, etc.
    }
  };
 
  return (
      <div className='index-container'>
        <h1>friendSync</h1>

        <form className='log-in-form' onSubmit={handleLogin}>

          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email"
            value={email} onChange= {(e) => setEmail(e.target.value)}  
            placeholder="Enter email"/>
          </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" 
              value={password} onChange= {(e) => setPassword(e.target.value)}
              placeholder="Enter password"/>
            </div>

          {error!=='error' ? <p className='red'>{error}</p> : <p className='white'>{error}</p>}

          <button type="submit">Log in</button>
          
        </form>

        <div className='other-info-container'>
          <h2>Or</h2>

          <GoogleSignIn />

          <p>Don't have an account? <Link to='sign-up'>Sign up</Link></p>
        </div>

      </div>
  )
}

export default Index
