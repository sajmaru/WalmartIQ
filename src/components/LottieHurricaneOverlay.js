// src/components/LottieHurricaneOverlay.js - Using real Lottie tornado animation
import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

// Add CSS for pulse animation
const pulseKeyframes = `
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
}`;

// Inject CSS
if (typeof document !== 'undefined' && !document.getElementById('pulse-animation')) {
  const style = document.createElement('style');
  style.id = 'pulse-animation';
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

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

// Walmart store locations along Hurricane Ian's path with sales impact data
const WALMART_STORES = [
  // Florida stores - most impacted
  {
    id: 'FL001',
    name: 'Walmart Supercenter - Fort Myers',
    lat: 26.55,
    lon: -81.95,
    salesImpact: {
      preStorm: 125000,
      duringStorm: 15000,
      postStorm: 45000,
      percentChange: -64,
      status: 'severe',
      daysClosedCompletely: 4,
      restockingTime: '2 weeks'
    }
  },
  {
    id: 'FL002', 
    name: 'Walmart Neighborhood Market - Naples',
    lat: 26.15,
    lon: -81.8,
    salesImpact: {
      preStorm: 85000,
      duringStorm: 8000,
      postStorm: 32000,
      percentChange: -62,
      status: 'severe',
      daysClosedCompletely: 6,
      restockingTime: '3 weeks'
    }
  },
  {
    id: 'FL003',
    name: 'Walmart Supercenter - Cape Coral',
    lat: 26.65,
    lon: -81.99,
    salesImpact: {
      preStorm: 145000,
      duringStorm: 12000,
      postStorm: 58000,
      percentChange: -60,
      status: 'severe',
      daysClosedCompletely: 5,
      restockingTime: '2.5 weeks'
    }
  },
  {
    id: 'FL004',
    name: 'Walmart Supercenter - Orlando',
    lat: 28.4,
    lon: -81.35,
    salesImpact: {
      preStorm: 165000,
      duringStorm: 45000,
      postStorm: 125000,
      percentChange: -24,
      status: 'moderate',
      daysClosedCompletely: 1,
      restockingTime: '1 week'
    }
  },
  {
    id: 'FL005',
    name: 'Walmart Supercenter - Tampa',
    lat: 27.95,
    lon: -82.45,
    salesImpact: {
      preStorm: 175000,
      duringStorm: 35000,
      postStorm: 110000,
      percentChange: -37,
      status: 'moderate',
      daysClosedCompletely: 2,
      restockingTime: '1.5 weeks'
    }
  },
  {
    id: 'FL006',
    name: 'Walmart Supercenter - Sarasota',
    lat: 27.35,
    lon: -82.53,
    salesImpact: {
      preStorm: 135000,
      duringStorm: 25000,
      postStorm: 85000,
      percentChange: -37,
      status: 'moderate',
      daysClosedCompletely: 2,
      restockingTime: '10 days'
    }
  },
  // Georgia stores - lighter impact
  {
    id: 'GA001',
    name: 'Walmart Supercenter - Valdosta',
    lat: 30.85,
    lon: -83.25,
    salesImpact: {
      preStorm: 125000,
      duringStorm: 95000,
      postStorm: 115000,
      percentChange: -8,
      status: 'minimal',
      daysClosedCompletely: 0,
      restockingTime: '3 days'
    }
  },
  // South Carolina stores
  {
    id: 'SC001',
    name: 'Walmart Supercenter - Charleston',
    lat: 32.8,
    lon: -79.95,
    salesImpact: {
      preStorm: 155000,
      duringStorm: 110000,
      postStorm: 140000,
      percentChange: -10,
      status: 'minimal',
      daysClosedCompletely: 0,
      restockingTime: '2 days'
    }
  },
  {
    id: 'SC002',
    name: 'Walmart Supercenter - Myrtle Beach',
    lat: 33.7,
    lon: -78.9,
    salesImpact: {
      preStorm: 135000,
      duringStorm: 115000,
      postStorm: 125000,
      percentChange: -7,
      status: 'minimal',
      daysClosedCompletely: 0,
      restockingTime: '1 day'
    }
  },
  // North Carolina stores
  {
    id: 'NC001',
    name: 'Walmart Supercenter - Wilmington',
    lat: 34.2,
    lon: -77.9,
    salesImpact: {
      preStorm: 145000,
      duringStorm: 125000,
      postStorm: 135000,
      percentChange: -7,
      status: 'minimal',
      daysClosedCompletely: 0,
      restockingTime: '1 day'
    }
  }
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

// Status colors for store impact visualization
const STATUS_COLORS = {
  severe: '#FF4757',   // Red
  moderate: '#FFA726', // Orange  
  minimal: '#66BB6A',  // Green
};

// Format currency for tooltips
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Removed the complex WalmartStoreMarker component - using simplified inline markers instead

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
  
  // Convert store coordinates to map coordinates
  const storeCoordinates = useMemo(() => 
    WALMART_STORES.map(store => ({
      ...store,
      coords: latLonToMapCoords(store.lat, store.lon, mapWidth, mapHeight)
    })),
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

  // Debug the store coordinates
  console.log('Store coordinates:', storeCoordinates.map(s => ({ id: s.id, coords: s.coords })));
  console.log('Map dimensions:', { mapWidth, mapHeight });

  return (
    <>
      {/* Map Overlay Container */}
      <div 
        style={{ 
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
            <line
              key={`path-${index}`}
              x1={prevCoord.x}
              y1={prevCoord.y}
              x2={coord.x}
              y2={coord.y}
              stroke={pathColor}
              strokeWidth="5"
              strokeDasharray="10,5"
              opacity="0.7"
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

      {/* Walmart Store Markers - Always visible layer */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          zIndex: 200, // Much higher to ensure visibility above everything
          pointerEvents: 'auto', // Enable interactions with markers
        }}
      >
        {storeCoordinates.map((store) => {
          // Add enhanced markers with debugging
          const coords = latLonToMapCoords(store.lat, store.lon, mapWidth, mapHeight);
          const statusColor = STATUS_COLORS[store.salesImpact.status];
          
          // Debug logging for each store
          console.log(`Rendering store ${store.id} at:`, {
            coords,
            lat: store.lat,
            lon: store.lon,
            statusColor,
            mapDimensions: { mapWidth, mapHeight }
          });
          
          return (
            <div
              key={store.id}
              title={`${store.name} - ${store.salesImpact.status.toUpperCase()} Impact (${store.salesImpact.percentChange}%)`}
              style={{
                position: 'absolute',
                left: coords.x - 12,
                top: coords.y - 12,
                width: 24,
                height: 24,
                backgroundColor: statusColor,
                borderRadius: '50%',
                border: '2px solid white',
                zIndex: 150, // Even higher z-index to ensure visibility
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.6)';
                e.currentTarget.style.zIndex = '300';
                // Show detailed tooltip on hover
                const tooltip = document.createElement('div');
                tooltip.id = `tooltip-${store.id}`;
                tooltip.style.cssText = `
                  position: absolute;
                  background: white;
                  color: #333;
                  padding: 6px;
                  border-radius: 4px;
                  font-size: 9px;
                  z-index: 400;
                  max-width: 280px;
                  bottom: 35px;
                  left: 50%;
                  transform: translateX(-50%);
                  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                  border: 1px solid #e0e0e0;
                  white-space: nowrap;
                `;
                tooltip.innerHTML = `
                  <div style="font-weight: bold; margin-bottom: 4px; font-size: 10px;">
                    🏪 ${store.name}
                  </div>
                  <div style="margin-bottom: 2px;">
                    <strong>Impact:</strong> <span style="color: ${statusColor}">${store.salesImpact.status.toUpperCase()}</span>
                  </div>
                  <div style="margin-bottom: 2px;">
                    <strong>Sales Change:</strong> ${store.salesImpact.percentChange}%
                  </div>
                  <div style="margin-bottom: 2px;">
                    <strong>Pre-Storm:</strong> ${formatCurrency(store.salesImpact.preStorm)}
                  </div>
                  <div style="margin-bottom: 2px;">
                    <strong>During Storm:</strong> ${formatCurrency(store.salesImpact.duringStorm)}
                  </div>
                  <div>
                    <strong>Days Closed:</strong> ${store.salesImpact.daysClosedCompletely} days
                  </div>
                `;
                e.currentTarget.appendChild(tooltip);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.zIndex = '150';
                // Remove tooltip
                const tooltip = document.getElementById(`tooltip-${store.id}`);
                if (tooltip) tooltip.remove();
              }}
            >
              {/* Store Icon */}
              <div style={{ 
                fontSize: '12px', 
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0,0,0,0.7)'
              }}>
                🏪
              </div>
              
              {/* Status indicator ring for severe impacts */}
              {store.salesImpact.status === 'severe' && (
                <div
                  style={{
                    position: 'absolute',
                    width: '36px',
                    height: '36px',
                    border: `2px solid ${statusColor}`,
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                    opacity: 0.6,
                    top: '-6px',
                    left: '-6px',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

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
      </div>

      {/* Controls - Positioned below the map */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.97)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          pointerEvents: 'auto',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <button
          style={{
            minWidth: '100px',
            padding: '8px 16px',
            background: '#FF6B9D',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onClick={isPlaying ? handlePause : handlePlay}
        >
          {isPlaying ? '⏸️' : '▶️'} {isPlaying ? 'Pause' : hasCompleted ? 'Replay' : 'Play'}
        </button>
        
        <button
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: '#FF6B9D',
            border: '1px solid #FF6B9D',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onClick={handleRestart}
        >
          🔄 Restart
        </button>
        
        <div style={{ marginLeft: '16px' }}>
          <div style={{ fontWeight: 'bold', color: '#333' }}>
            🌪️ {currentPoint.date}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Cat {currentPoint.category} • {currentPoint.windSpeed} mph
          </div>
        </div>
        
        {/* Store Impact Summary */}
        <div style={{ marginLeft: '16px', paddingLeft: '16px', borderLeft: '2px solid #eee' }}>
          <div style={{ fontWeight: 'bold', color: '#333', fontSize: '12px' }}>
            🏪 Store Impact Summary
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            <span style={{ 
              backgroundColor: STATUS_COLORS.severe, 
              color: 'white', 
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {WALMART_STORES.filter(s => s.salesImpact.status === 'severe').length} Severe
            </span>
            <span style={{ 
              backgroundColor: STATUS_COLORS.moderate, 
              color: 'white', 
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {WALMART_STORES.filter(s => s.salesImpact.status === 'moderate').length} Moderate
            </span>
            <span style={{ 
              backgroundColor: STATUS_COLORS.minimal, 
              color: 'white', 
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {WALMART_STORES.filter(s => s.salesImpact.status === 'minimal').length} Minimal
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LottieHurricaneOverlay;