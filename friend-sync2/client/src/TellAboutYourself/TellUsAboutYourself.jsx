import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../Authentication/AuthService';
import { isValidBirthDate } from '../SignUp/SignUp';

function TellUsAboutYourself() {
  const location = useLocation();
  const name = location.state && location.state.fullName;
  const email = location.state && location.state.email; 
  const [fullName, setFullName] = useState(name);
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Split the full name into an array of two pieces
  const namePieces = fullName.split(' ');

  // Now namePieces[0] will contain the first name, and namePieces[1] will contain the last name
  const given_name = namePieces[0];
  const last_name = namePieces[1];

  const data = {
    email: email,
    given_name: given_name,
    family_name: last_name,
    birthDate: birthDate
  }
  const createAccount = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if(!fullName){
      setError('Please fill in the name')
    }
    else if(!isValidBirthDate(birthDate, 18, 100)){
      setError('Invalid birth date or age not within the specified range.')
    }
    try {
      // Use await to wait for the login to complete before proceeding
      await AuthService.googleSignUp(data);
      navigate('/homepage');
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <>
    <h1>Tell us about you</h1>
      <form onSubmit={createAccount}>
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

