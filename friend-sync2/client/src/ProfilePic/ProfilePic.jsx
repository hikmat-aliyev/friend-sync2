/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'

// ... (previous imports)

const ProfilePictureUpload = ({ user }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    console.log(formData);

    try {
      // Send the formData and user ID to your server
      const response = await axios.post(
        `${API_BASE}/picture/upload/profile-pic`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            userId: user._id,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <div>
      <span className="material-symbols-outlined">
        person
      </span>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Profile Picture</button>
    </div>
  );
};

export default ProfilePictureUpload;

