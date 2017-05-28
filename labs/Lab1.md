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
var Message = require('azure-iot-device').Message; // Used for wrapping the sensor readings befor sending it to the IoT Hub
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
### Try it out
#### Prepare the Device
1. Unpack the Raspberry PI and attach the USB power cord. The device is pre-configured to connect to the network. 
2. Open PuTTY and connect using the settings given to you.
3. After successfully logged in to the Device, type: 
```
cd IOTBOOTCAMP
```
This will be the folder where you are going to store all labs. **PLEASE DO NOT USE ANY OTHER FOLDER, AS THE DEVICE IS GOING TO BE RESET FOR THE NEXT BOOTCAMP**

4. Create a new folder called “LAB1” by typing:
```
mkdir LAB1
```
5. Import NPM packages by typing:
```
npm install azure-iot-device azure-iot-device-mqtt sensortag
```

#### Deploy your solution

1. Back on your laptop, open a new command/terminal window, hit **Shift+CTRL+C** if you don’t have one open. Make sure you are in the Bootcamp directory (eg. *C:\IOTBOOTCAMP*), where you saved the **PSCP.exe** file.
2. Type the following command to deploy your code to the **LAB1** directory on the Device;
```
pscp -pw AzureIoT -r C:\IOTBOOTCAMP\LAB1\app.js root@**[YOURDEVICE]**:/root/IOTBOOTCAMP/LAB1
```
Change *[YOURDEVICE]* to the name of your Device. Make sure to update the path if you’re using a different directory.

#### Run the application
1. On the right side of the TI Sensor (with the logo facing you) you’ll find a power switch button. Press the button to turn on the sensor tag.
2. Go back to PuTTY and make sure you’re in the LAB1 folder.
3. Start the agent by typing:
```
node app.js
```
If all goes well you should read something like:
<pre>
<b>root@YOURDEVICE:~/IOTBOOTCAMP# node app.js</b>
<b>Successfully connected to the IoT Hub</b>
<b>        Sensor tag found... </b>
<b>        Successfully connected to TI sensor tag</b>
</pre>

**Congratulation! You’re now ready to start sending data**

### Read temperatures

In this step you will write code to read the temperature sensor on an every second interval. Setting up an interval using JavaScript is very easy using the **setInterval** function. The *setInterval* function takes two parameters; a callback function (where we call the sensor)  and the interval (in ms) of how often we like it to trigger. Eg:
```
setInterval(function () {
    // DO SOMETHING
}, 1000);
```
1. Directly after the line where you’re successfully connected to the TI Sensor, type:
```
setInterval(function () {
    sensorTag.readIrTemperature(function (error, objectTemperature, ambientTemperature) {
        if (err) {
            console.log('Unable to read sensor data:' + error);
        }
        else {
            console.log('\tObject Temperature: ' + objectTemperature);
            console.log('\tAmbient Temperature: ' + ambientTemperature);
            // Add code to submit the temperature to the ioT Hub
        }
    });
}, 2000);
```

#### Try it out (Optional)

Feel free to save your work and deploy it to the Device. You should get your temperatures printed out every second on the screen. 
<pre>
<b>If the sensor doesn’t connect, you’ll need to push the power button again</b>
</pre>

### Submit readings to IoT Hub

Wow, you’re getting close. All that is left to do is to actually submit the readings using the **sendEvent** function on the **client** object. The *sendEvent* function takes two parameters; message and callback. 

The message is a Azure IoT object that we’re going to wrap our sensor readings with. But first let’s create a JavaScript object with the data we want to send. Directly after you’ve received the temperatures, create an object called **readings**
```
var readings = {
    objectTemperature: objectTemperature,
    ambientTemperature: ambientTemperature,
    timeStamp: new Date(),
};
```
Next, create an IoT message by serializing the *readings* object:
```
var json = JSON.stringify(readings); 
var message = new Message(json);
```
Last step… send the message to the IoT Hub:
```
client.sendEvent(message, function(err){
    if (err) {
        console.log("Unable to send message. Error:" + err);
    }
    else{
        console.log('\tSuccessfully Submitted readings to the IoT hub');
        console.log();
    }
});
```

#### Try it out

Deploy the solution to the Device. You should get your temperatures printed out every second on the screen. 
<pre>
<b>If the sensor doesn’t connect, you’ll need to push the power button again</b>
</pre>

### **WELL DONE!** 
### Now lets move on to use the data...

## Create an Azure Stream Analytics Job


