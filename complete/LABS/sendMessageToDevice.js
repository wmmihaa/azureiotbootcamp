module.exports = function (context, msg) {

    var Client = require('azure-iothub').Client;
    var Message = require('azure-iot-common').Message;

    var connectionString = "YOUR IOT SERVICE CONNECTION STRING";
    var targetDevice = 'device2';

    var client = Client.fromConnectionString(connectionString);

    client.open(function (err) {
        if (err) {
            context.log.error('Could not connect: ' + err.message);
        }
        else {
            context.log('Client connected');

            var readings = JSON.parse(msg);

            // Only send warning iff temp is outside threshold
            if (readings.objectTemperature > 30 || readings.objectTemperature < 25) {

                var warning = {
                    acState: readings.objectTemperature > 30 ? "On" : "Off"
                }

                var message = new Message(JSON.stringify(warning));

                client.send(targetDevice, message, function (err) {
                    if (err)
                        context.log.error('Could not send command: ' + err.message);
                    else
                        context.log('Command sent');

                    context.done();
                });
            }
        }
    });
};