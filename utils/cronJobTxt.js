const fs = require('fs');
const path = require('path');

function logToFile(message) {
    const logFilePath = path.join(__dirname,'..','log', 'cron-job-log.txt'); // Log file path
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error("Failed to write to log file:", err);
      }
    });
  };

module.exports = logToFile;