import { useState } from 'react';
import PropTypes from 'prop-types';
import style from './HoverText.module.css';

const HoverText = ({ text, children = 'Hover over me' }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={style.hoverContainer}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {children}
      <div
        className={`${style.hoverText} ${hovered ? style.visible : ''}`}
        aria-hidden={!hovered}
      >
        {text}
      </div>
    </div>
  );
};

HoverText.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default HoverText;
