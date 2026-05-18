import React from 'react';
import { motion } from 'framer-motion';

const AntiGravityBackground = () => {
  const balls = [
    { size: 100, color: '#FFD700', initialX: '10%', initialY: '20%', duration: 25 }, // Yellow
    { size: 120, color: '#FF1493', initialX: '80%', initialY: '30%', duration: 30 }, // Pink
    { size: 80, color: '#00B0FF', initialX: '40%', initialY: '60%', duration: 22 }, // Blue
    { size: 90, color: '#FFD700', initialX: '70%', initialY: '80%', duration: 28 },
    { size: 110, color: '#FF1493', initialX: '20%', initialY: '50%', duration: 35 },
    { size: 70, color: '#00B0FF', initialX: '50%', initialY: '10%', duration: 27 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-[#87CEEB] to-[#E6E6FA]">

      {/* Floating Balls */}
      {balls.map((ball, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full opacity-30 blur-[2px]"
          style={{
            width: ball.size,
            height: ball.size,
            backgroundColor: ball.color,
            boxShadow: `0 0 40px ${ball.color}AA`,
            left: ball.initialX,
            top: ball.initialY,
          }}
          animate={{
            x: [0, 150, -150, 75, -75, 0],
            y: [0, -150, 150, -75, 75, 0],
          }}
          transition={{
            duration: ball.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Soft Overlays */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
    </div>
  );
};

export default AntiGravityBackground;
