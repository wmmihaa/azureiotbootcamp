var Message = require('azure-iot-device').Message;
var Protocol = require('azure-iot-device-mqtt').Mqtt; // AMQP or MQTT. Either one will work for this lab
var connectionString = '...';

var client = require('azure-iot-device').Client.fromConnectionString(connectionString, Protocol);

client.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    }
    else {
        console.log('Successfully connected to the IoT Hub');

        client.on('message', function (msg) {
            console.log('Received Command: WARNING');
            console.log(JSON.stringify(msg));
        });
    }
});
