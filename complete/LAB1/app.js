var SensorTag = require('sensortag');
var Message = require('azure-iot-device').Message;
var Protocol = require('azure-iot-device-mqtt').Mqtt; // AMQP or MQTT. Either one will work for this lab
var connectionString = 'HostName=d-rail-AzureIotHub.azure-devices.net;DeviceId=device1;SharedAccessKey=DZ9pqDKyqRcFD61iQioN+XjJr1LanDRLmfb4fzIXmYM=';

var client = require('azure-iot-device').Client.fromConnectionString(connectionString, Protocol);

client.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    }
    else {
        console.log('Successfully connected to the IoT Hub');
        setUpSensor( function (err, sensorTag) {
            if (err) {
                console.error('Could not connect to sensor: ' + err.message);
            }
            else {
                console.log('\tSuccessfully connected to TI sensor tag');

                setInterval(function () {
                    sensorTag.readIrTemperature(function (error, objectTemperature, ambientTemperature) {
                        console.log('error: ' + error);
                        console.log('objectTemperature: ' + objectTemperature);
                        console.log('ambientTemperature: ' + ambientTemperature);
                    });
                }, 2000);
            }
        });
    }
});

/* 
Setting up the sensor is done in three steps:
1. Discover the Sensor Tag
2. Connect the the Sensor Tag
3. Enable sensor (Temperature in our case)
*/
function setUpSensor(done) {
    // Find the Sensor Tag
    SensorTag.discover(function (sensorTag) {
        if (!sensorTag) {
            console.error('Could not find TI Sensor');
            done(err, null);
        }
        else {
            console.log('\tSensor tag found...');
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