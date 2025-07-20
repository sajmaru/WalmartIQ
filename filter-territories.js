// filter-territories.js - Run with: node filter-territories.js
// Place this file in your React project ROOT directory (same level as package.json)
const fs = require('fs');
const path = require('path');

// Territories and non-continental states to exclude
const territoriesToExclude = [
  // US Territories (outside North America)
  'American Samoa',
  'Commonwealth of the Northern Mariana Islands',
  'Guam', 
  'Puerto Rico',
  'United States Virgin Islands',
  
  // Non-continental US states
  'Alaska',           // Not continental
  'Hawaii',           // Not continental  
  'District of Columbia'  // Not a state, federal district
];

// File paths (relative to project root)
const inputFile = path.join(__dirname, 'public', 'maps', 'us-states.json');
const backupFile = path.join(__dirname, 'public', 'maps', 'us-states-original.json');

try {
  console.log('🗺️ Starting territory filtering...');
  console.log('📁 Input file:', inputFile);
  
  // Check if file exists
  if (!fs.existsSync(inputFile)) {
    console.error('❌ File not found:', inputFile);
    console.log('📁 Current directory:', __dirname);
    console.log('📁 Files in public/maps:');
    const mapsDir = path.join(__dirname, 'public', 'maps');
    if (fs.existsSync(mapsDir)) {
      fs.readdirSync(mapsDir).forEach(file => console.log('  -', file));
    } else {
      console.log('❌ public/maps directory not found');
    }
    process.exit(1);
  }
  
  // Create backup
  if (!fs.existsSync(backupFile)) {
    fs.copyFileSync(inputFile, backupFile);
    console.log('💾 Created backup:', backupFile);
  }
  
  console.log('📖 Reading original file...');
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  if (!data.objects || !data.objects.states) {
    console.error('❌ Invalid file structure. Expected objects.states');
    process.exit(1);
  }
  
  console.log(`📊 Original features: ${data.objects.states.geometries.length}`);
  
  // Filter out territories
  const filteredGeometries = data.objects.states.geometries.filter(geometry => {
    const name = geometry.properties?.name;
    const isTerritory = territoriesToExclude.includes(name);
    
    if (isTerritory) {
      console.log(`❌ Excluding: ${name}`);
    }
    
    return !isTerritory;
  });
  
  // Create new data object
  const filteredData = {
    ...data,
    objects: {
      ...data.objects,
      states: {
        ...data.objects.states,
        geometries: filteredGeometries
      }
    }
  };
  
  console.log(`📊 Filtered features: ${filteredGeometries.length}`);
  console.log(`🗑️ Removed: ${data.objects.states.geometries.length - filteredGeometries.length} territories`);
  
  // Write filtered file back
  fs.writeFileSync(inputFile, JSON.stringify(filteredData, null, 2));
  console.log(`✅ Updated file: ${inputFile}`);
  console.log('🎉 Territory filtering complete!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('💡 Make sure you run this from your React project root directory');
  console.log('💡 The directory should contain package.json and public/maps/us-states.json');
}