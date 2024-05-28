import React, { useRef, useEffect, useState } from 'react';

function DrawingBoard({ image }) {
  const canvasRef = useRef(null);
  const points = useRef([]);
  const isFinished = useRef(false);
  const img = useRef(new Image());
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    img.current.onload = function () {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.current.width;
      canvas.height = img.current.height;
      ctx.drawImage(img.current, 0, 0, img.current.width, img.current.height);
      const rect = canvas.getBoundingClientRect();
      setScale({ x: img.current.width / rect.width, y: img.current.height / rect.height });
    };
    img.current.src = image;
  }, [image]);

  const handleClick = (e) => {
    console.log(points.current)
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * scale.x;
    const y = (e.clientY - rect.top) * scale.y;
    if (isFinished.current) {
      points.current = [];
      isFinished.current = false;
    } else {
      points.current.push({ x, y });
      if (points.current.length === 4) {
        isFinished.current = true;
      }
    }
    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img.current, 0, 0, canvas.width, canvas.height);
    if (points.current.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points.current[0].x, points.current[0].y);
      points.current.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      if (isFinished.current) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.fill();
      }
      ctx.stroke();

      // Draw points
      points.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI); // Draw a larger circle
        ctx.fillStyle = 'black';
        ctx.fill();
      });
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'relative', maxWidth: '100%', left: 0, top: 0 }} onClick={handleClick} />
    </div>
  );
}

export default DrawingBoard;
