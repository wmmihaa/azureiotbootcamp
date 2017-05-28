# LAB 1 - Pushing telemetry data to Power BI

## Description
In this lab you’re going to develop a device agent to receive temperature data from the TI Sensor, and submitting these readings to the Azure IoT Hub. You are also going to configure an Azure Stream Analytics Job to receive the data from the IoT Hub and forward them to Power BI. The last step will be to create a Power BI report showing the data in real-time.

<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_3.png"/>

## Get started
You are going to develop the Agent using JavaScript on your laptop using Visual Studio Code. When you’re done, you will deploy the Agent to the Device using PSCP.
1. Create a Bootcamp directory on your laptop Eg. *C:\IOTBOOTCAMP*. 
2. Download **[PSCP](http://microservicebus.blob.core.windows.net/img/pscp.exe)** to the Bootcamp directory (**Only if you're on a Windows laptop**)
3. Create a **LAP1** folder in the *Bootcamp* directory
4. Open Visual Studio Code, and press **CTRL+K CTRL+O** and browse to the newly created *LAB1* folder (You may also use the *File* menu and select *Open Folder*)

## Connect to Azure IoT Hub
1. In order to connect to Azure we need to install a couple of NPM packages. From within VS Code hit Shift+CTRL+C to open a command prompt. Type:
<pre>
<b>npm install azure-iot-device azure-iot-device-mqtt</b> 
</pre>

2. From within Visual Studio Code hit *CTRL+N* to create a new file. Name the file **app.js**
3. Next, let's declare some of the objects and variables you're going to use:

```js
var Message = require('azure-iot-device').Message; 
var Protocol = require('azure-iot-device-mqtt').Mqtt; // AMQP or MQTT. Either one will work for this lab
var connectionString = '[THE DEVICE CONNECTIONSTRING YOU COPIED WHEN REGISTERING THE DEVICE]';
```

4. With the variables in place, it's time to create the client witch is going to connect to the Azure IoT Hub
```js
var client = require('azure-iot-device').Client.fromConnectionString(connectionString, Protocol);
```

5. Using the **open** function on the *client* will connect us to the IoT Hub:
```js
client.open(function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    } 
    else {
        console.log('Successfully connected to the IoT Hub');
    }
});
```
### Try it out
If you have closed the command/terminal window, hit Shift+CTRL+C again to open a new one. To start your application, type:
<pre>
<b>node app.js</b> 
</pre>

Close the console/terminal using **CTRL+C**.

#### Optional
You can run the application from within VS Code by hitting **F5**.

## Get temperature readings
Now you’re ready to start receiving sensor data from the TI sensor. Back in VS Code, at the top, create a reference to the TI Sensor package:
```js
var SensorTag = require('sensortag');
```
<pre>
<b>Please note that we are not installing the package yet, as it won't run on your laptop anyway...</b> 
</pre>


Setting up the sensor is done in three steps:
1. Discover the Sensor Tag
2. Connect the the Sensor Tag
3. Enable sensor (IR temperature in our case)
For more detailed information about the TI Sensor tag browse to [NPM page](https://www.npmjs.com/package/sensortag).

To simplify these steps add the function below att the bottom of the **app.js** file:
```js
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
```
This function will return a callback with the sensorTag object together with any errors. Call the setUpSensor function directly after you have successfully connected to the IoT Hub:
```js
setUpSensor( function (err, sensorTag) {
    if (err) {
        console.error('Could not connect to sensor: ' + err.message);
    }
    else {
        console.log('\tSuccessfully connected to TI sensor tag');
    }
});
```
