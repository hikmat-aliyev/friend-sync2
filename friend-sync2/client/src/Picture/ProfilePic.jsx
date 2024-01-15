/* eslint-disable react/prop-types */
import './ProfilePic.css'
import ProfileImg from '../images/default-profile.svg'
import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE = 'http://localhost:3000'
import { convertToBase64 } from './Picture';

const ProfilePictureUpload = ({user, profile}) => {
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

  useEffect(() => {
    fetchImage()
  }, [isMainUserProfile])

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
    <div> {loading ? <div> <img className='profile-default-pic' src={null} /> </div> :
      <div>
        <img onClick={handlePictureUploadPage}  className={isMainUserProfile ? 'profile-image' : 'profile-image-disabled' }
        src={currentImage.myFile == null ? ProfileImg : currentImage.myFile }/>
        <span className="material-symbols-outlined">photo_camera</span>
        {showPictureUploadPage && <div className='picture-upload-page'>
          <form onSubmit={handleImageSubmit}>
            <p onClick={() => {
              setShowPictureUploadPage(false);
              setUpdatedImage({ ...updatedImage, myFile: null})
            }}>x</p>
          <img onClick={handlePictureUploadPage}  className='updated-image' 
          src={updatedImage.myFile == null ? currentImage.myFile : updatedImage.myFile}/>

            <input type='file' 
                  label = 'Image'
                  name='myFile'
                  id='file-upload'
                  accept='.jpeg, .png, .jpg'
                  onChange={(e) => handleFileUpload(e)}/>

            {updatedImage.myFile !== null && <button type='submit'>Submit</button>}
            <div>
              <label htmlFor='file-upload'>Upload photo</label>
              {currentImage.myFile !== null && <button onClick={handleRemovePhoto}>Remove photo</button>}
            </div>
          </form>
        </div>}
      </div>}
    </div>
  );
};


export default ProfilePictureUpload;

