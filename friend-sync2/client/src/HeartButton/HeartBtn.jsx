import { useState } from 'react';
import './HeartBtn.css'

const HeartButton = () => {
  const [isActive, setIsActive] = useState(false);

  const handleLikeClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`heart-btn ${isActive ? 'heart-active' : ''}`}>
      <div className="content" onClick={handleLikeClick}>
        <span className={`heart ${isActive ? 'heart-active' : ''}`}></span>
        <span className="text">Like</span>
      </div>
    </div>
  );
};

export default HeartButton;
