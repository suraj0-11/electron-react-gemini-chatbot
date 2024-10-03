const fs = require('fs');
const path = require('path');

// Set the State directory in the main directory (not in the build folder)
const stateDir = path.join(__dirname, '..', 'State');

if (!fs.existsSync(stateDir)) {
  fs.mkdirSync(stateDir, { recursive: true });
  console.log('State directory created successfully');
} else {
  console.log('State directory already exists');
}
