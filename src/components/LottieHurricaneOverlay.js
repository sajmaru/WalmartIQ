// src/components/LottieHurricaneOverlay.js - Using real Lottie tornado animation
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Import Lottie (you'll need to install lottie-react first)
// npm install lottie-react
import Lottie from 'lottie-react';

// Import your downloaded tornado animation
// Place the tornado.json file in public/animations/ folder
const tornadoAnimationData = '/animations/tornado.json'; // Path to your Lottie file

// Real Hurricane Ian trajectory data (September 24-30, 2022)
const HURRICANE_IAN_PATH = [
  // Starting in Caribbean
  { lat: 19.8, lon: -82.1, category: 1, date: 'Sep 24, 6 AM', windSpeed: 75 },
  { lat: 20.2, lon: -82.8, category: 1, date: 'Sep 24, 12 PM', windSpeed: 80 },
  { lat: 20.8, lon: -83.9, category: 2, date: 'Sep 25, 6 AM', windSpeed: 100 },
  { lat: 21.5, lon: -84.8, category: 3, date: 'Sep 25, 12 PM', windSpeed: 115 },
  
  // Strengthening over Gulf
  { lat: 22.8, lon: -85.2, category: 3, date: 'Sep 26, 6 AM', windSpeed: 125 },
  { lat: 24.1, lon: -84.9, category: 4, date: 'Sep 27, 6 AM', windSpeed: 140 },
  { lat: 25.2, lon: -83.8, category: 4, date: 'Sep 27, 12 PM', windSpeed: 150 },
  
  // Approaching Florida - PEAK INTENSITY
  { lat: 26.1, lon: -82.4, category: 4, date: 'Sep 28, 6 AM', windSpeed: 155 },
  { lat: 26.6, lon: -82.1, category: 4, date: 'Sep 28, 12 PM', windSpeed: 150 }, // Landfall near Fort Myers
  
  // Moving across Florida
  { lat: 27.2, lon: -81.8, category: 2, date: 'Sep 28, 6 PM', windSpeed: 105 },
  { lat: 28.1, lon: -81.2, category: 1, date: 'Sep 29, 6 AM', windSpeed: 85 }, // Near Orlando
  { lat: 28.8, lon: -80.8, category: 1, date: 'Sep 29, 12 PM', windSpeed: 75 },
  
  // Exiting to Atlantic and moving north
  { lat: 30.2, lon: -80.2, category: 1, date: 'Sep 29, 6 PM', windSpeed: 70 },
  { lat: 32.8, lon: -78.9, category: 1, date: 'Sep 30, 6 AM', windSpeed: 75 }, // South Carolina
  { lat: 34.1, lon: -78.2, category: 1, date: 'Sep 30, 12 PM', windSpeed: 70 }, // North Carolina
];

// Improved coordinate conversion for US Mercator projection
const latLonToMapCoords = (lat, lon, mapWidth, mapHeight) => {
  // US-focused Mercator projection bounds
  const lonMin = -125; // West coast
  const lonMax = -66;  // East coast
  const latMin = 20;   // Southern border
  const latMax = 50;   // Northern border
  
  // Convert to percentage of map bounds
  const xPercent = (lon - lonMin) / (lonMax - lonMin);
  const yPercent = 1 - ((lat - latMin) / (latMax - latMin)); // Flip Y axis
  
  // Apply to map dimensions with padding
  const padding = 0.1; // 10% padding
  const x = (padding + xPercent * (1 - 2 * padding)) * mapWidth;
  const y = (padding + yPercent * (1 - 2 * padding)) * mapHeight;
  
  return { 
    x: Math.max(0, Math.min(mapWidth, x)), 
    y: Math.max(0, Math.min(mapHeight, y)) 
  };
};

// Hurricane size based on category (for Lottie scaling)
const getCategorySize = (category) => {
  const baseSizes = { 1: 40, 2: 55, 3: 70, 4: 85, 5: 100 };
  return baseSizes[category] || 40;
};

// Hurricane intensity colors for path
const CATEGORY_COLORS = {
  1: '#74B9FF', // Soft blue
  2: '#55A3FF', // Medium blue  
  3: '#FD79A8', // Soft pink
  4: '#FF7675', // Coral red
  5: '#E84393', // Deep pink
};

const LottieHurricaneIcon = ({ category, isActive, lottieRef }) => {
  const size = getCategorySize(category);
  const [animationData, setAnimationData] = useState(null);
  
  // Load the Lottie animation data
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(tornadoAnimationData);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load tornado animation:', error);
      }
    };
    
    loadAnimation();
  }, []);

  // Control animation playback based on isActive
  useEffect(() => {
    if (lottieRef.current) {
      if (isActive) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isActive, lottieRef]);

  if (!animationData) {
    // Fallback while loading
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${CATEGORY_COLORS[category]}88, ${CATEGORY_COLORS[category]}44)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        {category}
      </div>
    );
  }

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: isActive ? 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.3))' : 'none',
      }}
      animate={{
        scale: isActive ? [1, 1.1, 1] : 0.9,
      }}
      transition={{
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {/* Lottie Tornado Animation */}
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}
        autoplay={isActive}
        style={{
          width: '100%',
          height: '100%',
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid meet'
        }}
      />
      
      {/* Category indicator */}
      <motion.div
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          background: '#000',
          color: 'white',
          borderRadius: '50%',
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          border: '2px solid white',
          zIndex: 10,
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {category}
      </motion.div>
    </motion.div>
  );
};

const LottieHurricaneOverlay = ({ mapWidth, mapHeight, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const lottieRef = useRef();

  // Convert hurricane path to map coordinates
  const pathCoordinates = useMemo(() => 
    HURRICANE_IAN_PATH.map(point => latLonToMapCoords(point.lat, point.lon, mapWidth, mapHeight)),
    [mapWidth, mapHeight]
  );

  // Auto-start animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 800); // Small delay to ensure Lottie is loaded
    
    return () => clearTimeout(timer);
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= HURRICANE_IAN_PATH.length - 1) {
          setIsPlaying(false);
          setHasCompleted(true);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, 400); // Slightly slower for better tornado visibility

    return () => clearInterval(interval);
  }, [isPlaying, onComplete]);

  const handlePlay = () => {
    if (hasCompleted) {
      setCurrentStep(0);
      setHasCompleted(false);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setHasCompleted(false);
  };

  const currentPoint = HURRICANE_IAN_PATH[currentStep];
  const currentCoords = pathCoordinates[currentStep];

  return (
    <Box 
      sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        pointerEvents: 'none', // Allow map interaction underneath
        zIndex: 30,
      }}
    >
      {/* Hurricane Path Trail */}
      <svg 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Past path */}
        {pathCoordinates.slice(0, currentStep + 1).map((coord, index) => {
          if (index === 0) return null;
          const prevCoord = pathCoordinates[index - 1];
          const segmentCategory = HURRICANE_IAN_PATH[index].category;
          const pathColor = CATEGORY_COLORS[segmentCategory];
          
          return (
            <motion.line
              key={`path-${index}`}
              x1={prevCoord.x}
              y1={prevCoord.y}
              x2={coord.x}
              y2={coord.y}
              stroke={pathColor}
              strokeWidth="5"
              strokeDasharray="10,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.5 }}
              style={{ 
                filter: `drop-shadow(0 0 3px ${pathColor}88)`,
              }}
            />
          );
        })}
        
        {/* Future path (dimmed) */}
        {pathCoordinates.slice(currentStep + 1).map((coord, index) => {
          const actualIndex = currentStep + 1 + index;
          if (actualIndex === 0) return null;
          const prevCoord = pathCoordinates[actualIndex - 1];
          return (
            <line
              key={`future-path-${actualIndex}`}
              x1={prevCoord.x}
              y1={prevCoord.y}
              x2={coord.x}
              y2={coord.y}
              stroke="#BBB"
              strokeWidth="3"
              strokeDasharray="5,5"
              opacity="0.3"
            />
          );
        })}
      </svg>

      {/* Lottie Hurricane Animation */}
      <AnimatePresence>
        {currentCoords && (
          <motion.div
            style={{
              position: 'absolute',
              left: currentCoords.x - getCategorySize(currentPoint.category) / 2,
              top: currentCoords.y - getCategorySize(currentPoint.category) / 2,
              zIndex: 40,
              pointerEvents: 'auto',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15
            }}
          >
            <LottieHurricaneIcon 
              category={currentPoint.category} 
              isActive={isPlaying}
              lottieRef={lottieRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.97)',
          borderRadius: 2,
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          pointerEvents: 'auto',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={isPlaying ? handlePause : handlePlay}
          startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          sx={{ 
            minWidth: 100,
            background: '#FF6B9D',
            '&:hover': { background: '#FF4081' }
          }}
        >
          {isPlaying ? 'Pause' : hasCompleted ? 'Replay' : 'Play'}
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          onClick={handleRestart}
          startIcon={<RestartAltIcon />}
          sx={{ 
            borderColor: '#FF6B9D',
            color: '#FF6B9D',
            '&:hover': { borderColor: '#FF4081', backgroundColor: 'rgba(255, 107, 157, 0.1)' }
          }}
        >
          Restart
        </Button>
        
        <Box sx={{ ml: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            🌪️ {currentPoint.date}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cat {currentPoint.category} • {currentPoint.windSpeed} mph
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LottieHurricaneOverlay;