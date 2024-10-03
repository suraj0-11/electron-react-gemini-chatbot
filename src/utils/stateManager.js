const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Set the State directory in the local app data folder
const stateDir = path.join(app.getPath('userData'), 'State');

// Ensure that the State directory exists
if (!fs.existsSync(stateDir)) {
  fs.mkdirSync(stateDir, { recursive: true });
}

// Function to save user interactions as JSON files
function saveInteraction(interaction) {
  const fileName = `interaction_${Date.now()}.json`;
  const filePath = path.join(stateDir, fileName);
  console.log(fileName,filePath,"hello 17");
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(interaction, null, 2));
    console.log(`Interaction saved to: ${filePath}`);
  } catch (error) {
    console.error('Error saving interaction:', error);
  }
}

// Function to get all interaction logs from JSON files
function getInteractions() {
  try {
    const files = fs.readdirSync(stateDir);
    return files.map((file) => {
      const filePath = path.join(stateDir, file);
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });
  } catch (error) {
    console.error('Error reading interactions:', error);
    return [];
  }
}

module.exports = {
  saveInteraction,
  getInteractions,
};
