import './Index.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import AuthService from './Authentication/AuthService';

function TellUsAboutYourself() {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Use await to wait for the login to complete before proceeding
      await AuthService.login(fullName, birthDate);
      setError(null);
      navigate('/homepage')

    } catch (error) {
      setError('Incorrect email or password')
      console.error('Login failed:', error.message);
      // Handle login failure, show an error message, etc.
    }
  };

  return (
    <>
    <h1>Tell us about you</h1>
      <form onSubmit={handleLogin}>
        <input type="text" name="firstName"
        value={fullName} onChange= {(e) => setFullName(e.target.value)}  />

        <input type="date" name="birthDate" value={birthDate}
        placeholder='DD/MM/YYYY' onChange= {(e) => setBirthDate(e.target.value)}/>

        {error && <p>{error}</p>}
        <button type="submit">Create Account</button>
    
      </form>
   </>
  )
}

export default TellUsAboutYourself;

