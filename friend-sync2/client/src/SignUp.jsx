import './Index.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthService from './Authentication/AuthService';
import GoogleSignUp from './GoogleSignUp';

// eslint-disable-next-line react-refresh/only-export-components
export const isValidBirthDate = (birthDate, minAge, maxAge) => {
  const today = new Date();
  const inputDate = new Date(birthDate);
  const age = today.getFullYear() - inputDate.getFullYear();

  return (
    !isNaN(inputDate.getTime()) &&
    inputDate <= today &&
    age >= minAge &&
    age <= maxAge
  );
};

function Index() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if(!firstName || !lastName || !email || !birthDate || !password || !confirmPassword){
      setError('Please fill in all fields')
      return
    }
    else if(password !== confirmPassword){
      setError('Passwords do not match!')
      return
    }
    else if(!isValidBirthDate(birthDate, 18, 100)){
      setError('Invalid birth date or age not within the specified range.')
      return
    }
    try {
      // Use await to wait for the login to complete before proceeding
      await AuthService.signUp(firstName, lastName, email, birthDate, password);
      navigate('/homepage');
    } catch (error) {
      //if we get error, it means email is already registered as I return 409 status in backend
      setError('Email is already registered')
      console.error('Login failed:', error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSignUp}>
        <label htmlFor="firstName">First Name</label>
        <input type="text" name="firstName"
        value={firstName} onChange= {(e) => setFirstName(e.target.value)}  />

        <label htmlFor="lastName">Last Name</label>
        <input type="text" name="lastName"
        value={lastName} onChange= {(e) => setLastName(e.target.value)}  />

        <label htmlFor="email">Email</label>
        <input type="email" name="email"
        value={email} onChange= {(e) => setEmail(e.target.value)}  />

        <label htmlFor="birthDate">Birthday</label>
        <input type="date" name="birthDate" value={birthDate}
        placeholder='DD/MM/YYYY' onChange= {(e) => setBirthDate(e.target.value)}/>  
          
        <label htmlFor="password">Password</label>
        <input type="password" name="password" 
        value={password} onChange= {(e) => setPassword(e.target.value)}/>

        <label htmlFor="confirmPassword">Confirm password</label>
        <input type="password" name="confirmPassword" 
        value={confirmPassword} onChange= {(e) => setConfirmPassword(e.target.value)}/>

        {error && <p>{error}</p>}
        <button type="submit">Sign up</button>
    
      </form>
     <p>Or</p>
     <GoogleSignUp />
   </>
  )
}

export default Index

