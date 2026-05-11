import React from 'react';
import { motion } from 'framer-motion';

const Silhouette = ({ color, delay, x }) => (
  <motion.div
    className="absolute bottom-[-10px] will-change-transform"
    style={{ left: x, opacity: 0.4, transformOrigin: "bottom center" }}
    animate={{ y: [0, -250, 0], scaleY: [1, 0.85, 1.1, 1] }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  >
    <svg width="90" height="140" viewBox="0 0 100 150" fill={color} className="drop-shadow-lg">
      <circle cx="50" cy="20" r="15" />
      <path d="M50 35 L50 80 L30 140 M50 80 L70 140 M20 50 L50 40 L80 50" stroke={color} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M35 40 Q50 35 65 40 L60 80 L40 80 Z" />
    </svg>
  </motion.div>
);

const AntiGravityBackground = () => {
  const balls = [
    { size: 100, color: '#FFD700', initialX: '10%', initialY: '20%', duration: 25 }, // Yellow
    { size: 120, color: '#FF1493', initialX: '80%', initialY: '30%', duration: 30 }, // Pink
    { size: 80, color: '#00B0FF', initialX: '40%', initialY: '60%', duration: 22 }, // Blue
    { size: 90, color: '#FFD700', initialX: '70%', initialY: '80%', duration: 28 },
    { size: 110, color: '#FF1493', initialX: '20%', initialY: '50%', duration: 35 },
    { size: 70, color: '#00B0FF', initialX: '50%', initialY: '10%', duration: 27 },
  ];

  const silhouetts = [
    { color: '#FF0000', x: '10%', delay: 0 },
    { color: '#00B0FF', x: '25%', delay: 0.4 },
    { color: '#00FF00', x: '65%', delay: 0.2 },
    { color: '#FF0000', x: '85%', delay: 0.6 },
    { color: '#00FF00', x: '45%', delay: 0.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-gradient-to-br from-[#87CEEB] to-[#E6E6FA]">
      {/* Jumping Human Silhouettes */}
      {silhouetts.map((s, i) => (
        <Silhouette key={i} {...s} />
      ))}

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
