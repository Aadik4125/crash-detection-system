const fs = require('fs');
const chokidar = require('chokidar');
const csv = require('csv-parser');
const Record = require('../models/Record');

const startWatching = (filePath) => {
  if (!filePath) return;

  if (!fs.existsSync(filePath)) {
    console.log(`File ${filePath} doesn't exist yet. Waiting for it to be created...`);
  } else {
    console.log(`Watching ${filePath} for changes...`);
  }

  const watcher = chokidar.watch(filePath, {
    persistent: true,
    usePolling: true,
    interval: 2000
  });

  watcher.on('add', path => parseData(path));
  watcher.on('change', path => parseData(path));
};

const parseData = (filePath) => {
  console.log('Detected CSV change, parsing data...');
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        // Clear old records and re-import all data from CSV
        // This ensures the dashboard always reflects the current CSV content
        await Record.deleteMany({});

        let newCount = 0;
        const baseTime = new Date(); // Use current time as base

        for (const row of results) {
          // Support both CSV formats:
          // Format 1 (LOGS.CSV): timestamp, speed, tilt, vibration, acc_x, acc_y, acc_z, status
          // Format 2 (data.csv): timestamp, accX, accY, accZ, speed, tiltAngle, vibration

          const msOffset = parseInt(row.timestamp) || 0;
          const recordTime = new Date(baseTime.getTime() - ((results.length - newCount) * 1000) + msOffset);

          const tilt = parseFloat(row.tilt || row.tiltAngle) || 0;
          const vib = parseFloat(row.vibration) || 0;
          const speed = parseFloat(row.speed) || 0;
          const accX = parseFloat(row.acc_x || row.accX) || 0;
          const accY = parseFloat(row.acc_y || row.accY) || 0;
          const accZ = parseFloat(row.acc_z || row.accZ) || 0;

          // Determine crash: use status column if available, otherwise use thresholds
          let isCrash = false;
          if (row.status) {
            isCrash = row.status.trim().toUpperCase().includes('CRASH');
          } else {
            isCrash = (tilt > 45 || vib > 25);
          }

          await Record.create({
            timestamp: recordTime,
            accelerationX: accX,
            accelerationY: accY,
            accelerationZ: accZ,
            speed: speed,
            tiltAngle: tilt,
            vibration: vib,
            isCrash: isCrash
          });
          newCount++;
        }

        if (newCount > 0) {
          console.log(`CSV Sync complete. Imported ${newCount} records.`);
        }
      } catch (err) {
        console.error('Error inserting records:', err);
      }
    });
};

module.exports = { startWatching };
