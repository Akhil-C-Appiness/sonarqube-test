// Magnifier.js

import React, { useRef, useEffect } from 'react';
// import './Magnifier.css';

function Magnifier({ src, alt }) {
  const imgRef = useRef();
  const lensRef = useRef();
  let zoomLevel = 1.3

  useEffect(() => {
    const img = imgRef.current;
    const lens = lensRef.current;

    const magnify = (e) => {
      const bounds = img.getBoundingClientRect();
      const x = e.pageX - bounds.left - window.pageXOffset;
      const y = e.pageY - bounds.top - window.pageYOffset;


      lens.style.top = `${y - lens.offsetHeight / 2}px`;
      lens.style.left = `${x - lens.offsetWidth / 2}px`;
      lens.style.backgroundSize = `${bounds.width * zoomLevel}px ${bounds.height * zoomLevel}px`;
      lens.style.backgroundPositionX = `${-x * zoomLevel + 200 / 2}px`;
      lens.style.backgroundPositionY = `${-y * zoomLevel + 200 / 2}px`;
    
      lens.style.visibility = 'visible';
    };

    const hideLens = () => {
      lens.style.visibility = 'hidden';
    };

    img.addEventListener('mousemove', magnify);
    img.addEventListener('mouseout', hideLens);

    return () => {
      img.removeEventListener('mousemove', magnify);
      img.removeEventListener('mouseout', hideLens);
    };
  }, [src]);

  return (
    <div className="magnifier-container">
      <div
        className="magnifier-lens"
        ref={lensRef}
        style={{ backgroundImage: `url(${src})` }}
      />
      <img src={src} alt={alt} ref={imgRef} />
    </div>
  );
}

export default Magnifier;
