import { useState } from 'react';
import './HeartBtn.css'

const HeartButton = (isLiked) => {
  const [isActive, setIsActive] = useState(isLiked.isLiked);

  const handleLikeClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`heart-btn ${isActive ? 'heart-active' : ''}`}>
      <div className="content" onClick={handleLikeClick}>
        <span className={`heart ${isActive ? 'heart-active' : ''}`}></span>
        {!isActive ? <span className="text">Like</span> : null }
      </div>
    </div>
  );
};

export default HeartButton;
