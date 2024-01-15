import { useRef, useState } from "react";
import './EditPost.css';
import '../Post.css'
import { convertToBase64 } from "../../Picture/Picture";
import axios from "axios";
const API_BASE = 'http://localhost:3000';

/* eslint-disable react/prop-types */
function EditPost ({setPosts, index, setEditMode, post, setActivePostIndex, editMode}) {
  const [editedText, setEditedText] = useState(post.text);
  const [editedImage, setEditedImage] = useState(post.post_picture);
  // const editedImageInput = useRef(null);

  async function handleEditedPostSubmit() {
    try {
      const response = await axios.post(`${API_BASE}/post/update`, {
        post, editedText, editedImage 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const updatedPost = response.data;
      setPosts(prevPosts => {
        const newPosts = [...prevPosts];
        newPosts[index] = updatedPost;
        return newPosts;
      });
      setEditMode(false);
      setActivePostIndex(null);
    } catch(err) {
      console.log(err);
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setEditedImage(base64);
    // editedImageInput.current.value = null;
  }

  return (
    <>
      {editMode && (
        <section className="edit-post-section">
          <div className='edit-post-container'>
            <div className="edit-post-header">
              <h2>Edit post</h2>
              <span onClick={() => {
                setEditMode(false)
                setActivePostIndex(null)
                }} className="material-symbols-outlined x-close-button">close</span>
            </div>
            <div className='post-header'>
              <h2>{post.username}</h2> 
            </div>
            <form>
              <textarea type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)}/>
            </form>
            <div className="edit-image-container">
              <div>
                <span onClick={() => setEditedImage(null)} className="material-symbols-outlined x-close-button">
                  close
                </span>
                <img src={editedImage} className='post-create-image'/>
              </div>
              <input type='file' label ='Image' name='edited_post_picture' id='edited-pic-upload'
                accept='.jpeg, .png, .jpg' onChange={(e) => handleFileUpload(e)}/>
              <label htmlFor='edited-pic-upload'>
                <span className="material-symbols-outlined post-create-image-icon">
                  image
                </span>
              </label>
            </div>
            <button onClick={() => handleEditedPostSubmit()} type='submit'>
              Save
            </button>
          </div>
        </section>
      )}
    </>
  );
}

export default EditPost;
