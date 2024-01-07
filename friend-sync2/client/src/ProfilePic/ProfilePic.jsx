import './ProfilePic.css'
import ProfileImg from '../images/default-profile.svg'
import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'

// eslint-disable-next-line react/prop-types
const ProfilePictureUpload = ({user}) => {

  const [postImage, setPostImage] = useState({ myFile: '' })

  useEffect(() => {
    const fetchImage = async () => {
      try{
        const response = await axios.post(`${API_BASE}/find/profile/image`, {
          user
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        setPostImage({ ...postImage, myFile: response.data })
      }catch(err){
        console.log(err)
      }
    }
    fetchImage()
  }, [])

  const createPost = async (newImage) => {
    try{
      await axios.post(`${API_BASE}/picture/upload/profile`, {
        newImage, user
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }catch(err){
      console.log(err)
    }
  }

  const handleImageSubmit = (e) => {
    e.preventDefault();
    createPost(postImage.myFile);
    console.log('uploaded')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage({ ...postImage, myFile: base64 })
  }

  return (
    <div>
      <form onSubmit={handleImageSubmit}>
        <label htmlFor='file-upload'>
          <img className='profile-image' src={postImage.myFile || ProfileImg} alt='' />
        </label>
        <input type='file' 
               label = 'Image'
               name='myFile'
               id='file-upload'
               accept='.jpeg, .png, .jpg'
               onChange={(e) => handleFileUpload(e)}/>

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

function convertToBase64(file){
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  })
}

export default ProfilePictureUpload;

