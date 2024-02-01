import { useState } from "react";
import './EditPost.css';
import '../Post.css'
import { convertToBase64 } from "../../Picture/Picture";
import axios from "axios";
const API_BASE = 'http://localhost:3000';

/* eslint-disable react/prop-types */
function EditPost ({setPosts, index, setEditMode, post, setActivePostIndex, editMode}) {
  const [editedText, setEditedText] = useState(post.text);
  const [editedImage, setEditedImage] = useState(post.post_picture);
  const [ready, setReady] = useState(false);

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
      setReady(false);
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
    setReady(true);
  }

  return (
    <>
      {editMode && (
        <section className="edit-section">
            <div className="section-header">
              <h1>Edit post</h1>
              <span onClick={() => {
                setEditMode(false)
                setReady(false)
                setActivePostIndex(null)
                }} className="material-symbols-outlined x-close-button">close</span>
            </div>

            <div className="edited-post-header">
              <img src={post.user.profile_pic} alt="" />
              <h2>{post.username}</h2> 
            </div>

            <form>
              <textarea type="text" value={editedText} onChange={(e) => {
                setEditedText(e.target.value)
                setReady(true)}}/>
            </form>

            <div className="edit-image-container">

              {editedImage && <div className="post-image-edited">
                <span onClick={() => setEditedImage(null)} className="material-symbols-outlined x-close-button">
                  close
                </span>
                <img src={editedImage}/>
              </div>}

              <input type='file' label ='Image' name='edited_post_picture' id='edited-pic-upload'
                accept='.jpeg, .png, .jpg' onChange={(e) => handleFileUpload(e)}/>

              <label htmlFor='edited-pic-upload'>
                <span className="material-symbols-outlined post-create-image-icon">
                  image
                </span>
              </label>

            </div>

           {ready 
           ?  <button className='enabled-edit-save-btn' onClick={() => handleEditedPostSubmit()} type='submit'>
                Save
              </button> 
            : <button className='disabled-edit-save-btn'>Save</button>}

        </section>
      )}
    </>
  );
}

export default EditPost;
