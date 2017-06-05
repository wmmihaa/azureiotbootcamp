var SensorTag = require('sensortag');
var sensorId = '24:71:89:BC:12:06';

setUpSensor(sensorId, function () {
  console.log('COMPLETE');
});

function setUpSensor(sensorId, done) {
  sensorId = sensorId.replace(/:/g, '').toLowerCase(); 
  // Find the Sensor Tag
  console.log('Trying to find the sensor tag: ' + sensorId);
  
  SensorTag.discoverById(sensorId, function (sensorTag) {
    if (!sensorTag) {
      console.error('Could not find TI Sensor');
      done(err, null);
    }
    else {
      console.log('\tSensor tag found...');
      console.log('sensorTag:' + sensorTag);

      // Connect the Sensor Tag
      sensorTag.connectAndSetUp(function (err) {
        if (err) {
          done(err, null);
        }
        else {
          // Enable the temperature sensor 
          sensorTag.enableIrTemperature(function (err) {
            done(err, sensorTag);
          });
        }
      });
    }
  });
}