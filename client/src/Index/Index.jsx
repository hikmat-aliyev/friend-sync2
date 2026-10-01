/* eslint-disable react/no-unescaped-entities */
import './Index.css'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../Authentication/AuthService';
import GoogleSignIn from '../Google/GoogleSignIn';
import image2 from '../images/index-image.png'

function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("error");
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      // Use await to wait for the login to complete before proceeding
      await AuthService.login(email, password);
      setError(null);
      setLoading(false);
      navigate('/homepage')
    } catch (error) {
      setError('Incorrect email or password');
      setLoading(false);
      console.error('Login failed:', error.message);
    }
  };

  async function handleDefaultLogin(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      setLoading(true);
      // Use await to wait for the login to complete before proceeding
      await AuthService.login('default@gmail.com', '12345');
      setError(null);
      setLoading(false);
      navigate('/homepage')
    } catch (error) {
      setError('Incorrect email or password')
      console.error('Login failed:', error.message);
      // Handle login failure, show an error message, etc.
    }
  }
 
  return (
    <>
    {!loading ?
     <div className='index-container'>
      <img src={image2} />
        <div className='login-container'>
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

          <button onClick={handleDefaultLogin} className='default-account-login'>Continue with a default account</button>

      </div>
    </div> : <p className='index-loading-text'>Loading...</p>}</>
    
  )
}

export default Index
