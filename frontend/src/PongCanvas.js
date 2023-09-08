import React, { useEffect, useRef } from 'react';

const PongCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw paddles and ball
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(10, 10, 10, 50); // Left paddle
    ctx.fillRect(canvas.width - 20, 10, 10, 50); // Right paddle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  return <canvas ref={canvasRef} width={600} height={400} />;
};

export default PongCanvas;
