var SensorTag = require('sensortag');
var sensorId = '24:71:89:BC:12:06';

var Message = require('azure-iot-device').Message;
var Protocol = require('azure-iot-device-mqtt').Mqtt; // AMQP or MQTT. Either one will work for this lab
var connectionString = '..';

var client = require('azure-iot-device').Client.fromConnectionString(connectionString, Protocol);

client.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    }
    else {
        console.log('Successfully connected to the IoT Hub');
        setUpSensor(sensorId, function (err, sensorTag) {
            if (err) {
                console.error('Could not connect to sensor: ' + err.message);
            }
            else {
                console.log('\tSuccessfully connected to TI sensor tag');
                setInterval(function () {
                    sensorTag.readIrTemperature(function (error, objectTemperature, ambientTemperature) {
                        if (err) {
                            console.log('Unable to read sensor data:' + error);
                        }
                        else {
                            console.log('\tObject Temperature: ' + objectTemperature);
                            console.log('\tAmbient Temperature: ' + ambientTemperature);
                            // Add code to submit the temperature to the ioT Hub

                            var readings = {
                                objectTemperature: objectTemperature,
                                ambientTemperature: ambientTemperature,
                                timeStamp: new Date(),
                            };

                            var json = JSON.stringify(readings);
                            var message = new Message(json);

                            client.sendEvent(message, function (err) {
                                if (err) {
                                    console.log("Unable to send message. Error:" + err);
                                }
                                else {
                                    console.log('\tSuccessfully Submitted readings to the IoT hub');
                                    console.log();
                                }
                            });
                        }
                    });
                }, 2000);
            }
        });
    }
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
            console.log('\tsensorTag:' + sensorTag);

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