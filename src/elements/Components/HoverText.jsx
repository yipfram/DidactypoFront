import { useState } from 'react';
import './HoverText.module.css'; // You can style this in your CSS file

const HoverText = ({ text }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="hover-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Hover over me
      {hovered && <div className="hover-text">{text}</div>}
    </div>
  );
};

export default HoverText;
