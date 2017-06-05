var SensorTag = require('sensortag');
var Message = require('azure-iot-device').Message;
var Protocol = require('azure-iot-device-mqtt').Mqtt; // AMQP or MQTT. Either one will work for this lab
var connectionString = 'HostName=demo-AzureIoTHub.azure-devices.net;DeviceId=DEVICE1;SharedAccessKey=HSDV4Dbq8bbR9i5X2sPrtODl2DnqnTuxjDVsxg6Lvq4=';

var client = require('azure-iot-device').Client.fromConnectionString(connectionString, Protocol);

client.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    }
    else {
        console.log('Successfully connected to the IoT Hub');
        setUpSensor(function (err, sensorTag) {
            if (err) {
                console.error('Could not connect to sensor: ' + err.message);
            }
            else {
                console.log('\tSuccessfully connected to TI sensor tag');
                
                setUpSensor('247189BC1206', function(){
                    console.log('COMPLETE');
                    
                });
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
function setUpSensor(sensorId, done) {
    // Find the Sensor Tag
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