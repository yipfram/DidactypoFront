import { useState } from 'react';
import style from './HoverText.module.css'; // You can style this in your CSS file

const HoverText = ({ text }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={style.hoverContainer}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Hover over me
      {hovered && <div className={style.hoverText}>{text}</div>}
    </div>
  );
};

export default HoverText;
