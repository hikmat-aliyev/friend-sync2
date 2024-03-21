/* eslint-disable react/prop-types */
import './ProfilePic.css'
import ProfileImg from '../images/default-profile.svg'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../Authentication/AuthService';
import { convertToBase64 } from './Picture';
import cameraImg from '../images/camera.svg'

const ProfilePictureUpload = ({user, profile, setBackgroundShadow}) => {
  //check if we are in other person profile page or in our own profile page
  const isMainUserProfile = user._id == profile._id

  const [currentImage, setCurrentImage] = useState({ myFile: null });
  const [updatedImage, setUpdatedImage] = useState({ myFile: null });
  const [showPictureUploadPage, setShowPictureUploadPage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchImage = async () => {
    try{
      setLoading(true)
      const response = await axios.post(`${API_BASE}/find/profile/image`, {
        profile
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      !response.data ? setCurrentImage({ ...currentImage, myFile: null })
      : setCurrentImage({ ...currentImage, myFile: response.data })

    }catch(err){
      setCurrentImage({ ...currentImage, myFile: null })
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  //fetch image when profile id changes
  useEffect(() => {
    fetchImage()
  }, [profile._id])

  const createPost = async (newImage) => {
    try{
      const response = await axios.post(`${API_BASE}/picture/upload/profile`, {
        newImage, profile
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      //if success, fetch new current image
      if(response.data){
        fetchImage() 
      }
    }catch(err){
      console.log(err)
    }
  }

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    createPost(updatedImage.myFile);
    setShowPictureUploadPage(false);
    console.log('uploaded')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setUpdatedImage({ ...updatedImage, myFile: base64 });
  }

  const handlePictureUploadPage = () => {
    setShowPictureUploadPage(true);
  }

  async function handleRemovePhoto() {
    try{
      const response = await axios.post(`${API_BASE}/picture/remove/profile`, {
         profile
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if(response.data){
        setCurrentImage({ ...currentImage, myFile: null })
        setUpdatedImage({ ...updatedImage, myFile: null})
      }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div> {loading ?
       <div> 
          <img className='profile-default-pic' src={null} />
      </div>
        :
      <div>
        <div className='profile-image-container'>
          <img className= 'profile-image-disabled' 
          src={currentImage.myFile == null ? ProfileImg : currentImage.myFile }/>
          {isMainUserProfile && <img onClick={() => {
            handlePictureUploadPage()
            setBackgroundShadow(true)
          }} className='camera-svg' src={cameraImg}/>}
        </div>
  
        {showPictureUploadPage && 
        <div className='picture-upload-page'>
          <div className='picture-upload-header'>
            <h1>Edit profile image</h1>
            <p onClick={() => {
                setShowPictureUploadPage(false);
                setUpdatedImage({ ...updatedImage, myFile: null})
                setBackgroundShadow(false)
              }}>x</p>
          </div>

          <form onSubmit={handleImageSubmit}>
            <img onClick={handlePictureUploadPage}  className='updated-image' 
            src={updatedImage.myFile == null ? currentImage.myFile : updatedImage.myFile}/>

            <input type='file' 
                  label = 'Image'
                  name='myFile'
                  id='file-upload'
                  accept='.jpeg, .png, .jpg'
                  onChange={(e) => handleFileUpload(e)}/>

  
            <div className='upload-remove-photo-container'>
              <label htmlFor='file-upload'>Upload photo</label>
              {currentImage.myFile !== null && <button onClick={() => {
                handleRemovePhoto()
                setBackgroundShadow(false)
              }}>Remove photo</button>}
               {updatedImage.myFile !== null && <button onClick={() => setBackgroundShadow(false)} type='submit'>Submit</button>}
            </div>
          </form>
        </div>}
      </div>}
    </div>
  );
};


export default ProfilePictureUpload;

