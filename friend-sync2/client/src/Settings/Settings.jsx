import { useState } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Settings.css'

function Settings() {
  const location = useLocation();
  const user = location.state.user;
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [city, setCity] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [school, setSchool] = useState('');
  const [relationship, setRelationship] = useState('');

  return(
    <div> 
        <Navbar user={user}/>
        <div>
          <h1>Settings</h1>
          <div>
            <h2>Change name</h2>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text"/>  
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text"/>  
          </div>
          <div>
            <h2>About</h2>
            <div className="about-inputs">
              <input value={city} onChange={(e) => setCity(e.target.value)} type="text" placeholder="Current city"/>
              <input value={workplace} onChange={(e) => setWorkplace(e.target.value)} type="text" placeholder="Workplace"/>
              <input value={school} onChange={(e) => setSchool(e.target.value)} type="text" placeholder="School"/>
              <input value={relationship} onChange={(e) => setRelationship(e.target.value)} type="text" placeholder="Relationship Status" />
            </div>
            <button>Save</button>
          </div>
        </div>
    </div>
  )
}

export default Settings;