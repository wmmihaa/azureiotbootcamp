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

## Develop Device Agent
```
While we're developing we're going to reference several NPM packages. 
However, we're not going to download these until we've deployed the solution to the Device 
```
1. From within Visual Studio Code hit *CTRL+N* to create a new file. Name the file **app.js**
2. Next, let's declare some of the objects and variables you're going to use:

```js
var SensorTag = require('sensortag'); // TI Sensor used to interact with the temperature sensor

var Message = require('azure-iot-device').Message; 
var Protocol = require('azure-iot-device-mqtt').Mqtt; // AMQP or MQTT. Either one will work for this lab
var connectionString = '[THE DEVICE CONNECTIONSTRING YOU COPIED WHEN REGISTERING THE DEVICE]'
```

3. With the variables in place, it's time to create the client witch is going to connect to the Azure IoT Hub
```js
var client = require('azure-iot-device').Client.fromConnectionString(connectionString, Protocol);
```

4. Using the **open** function on the *client* will connect us to the IoT Hub:
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