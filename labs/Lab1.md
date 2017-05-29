# LAB 1 - Pushing telemetry data to Power BI

## Description
In this lab you’re going to develop a device agent to receive temperature data from the TI Sensor, and submitting these readings to the Azure IoT Hub. You are also going to configure an Azure Stream Analytics Job to receive the data from the IoT Hub and forward them to Power BI. The last step will be to create a Power BI report showing the data in real-time.

<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_3.png"/>

## Get started
You are going to develop the Agent using JavaScript on your laptop using Visual Studio Code. When you’re done, you will deploy the Agent to the Device using PSCP.
1. Create a Bootcamp directory on your laptop Eg. *C:\IOTBOOTCAMP*. 
2. Download **[PSCP](http://microservicebus.blob.core.windows.net/img/pscp.exe)** to the Bootcamp directory (**Only if you're on a Windows laptop**)
3. Create a **LABS** folder in the *Bootcamp* directory
4. Open Visual Studio Code, and press **CTRL+K CTRL+O** and browse to the newly created *LABS* folder (You may also use the *File* menu and select *Open Folder*)

## Connect to Azure IoT Hub
1. In order to connect to Azure we need to install a couple of NPM packages. From within VS Code hit Shift+CTRL+C to open a command prompt. Type:
<pre>
<b>npm install azure-iot-device azure-iot-device-mqtt</b> 
</pre>

2. From within Visual Studio Code hit *CTRL+N* to create a new file. Name the file **lab1.js**
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
<b>node lab1.js</b> 
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

To simplify these steps add the function below att the bottom of the **lab1.js** file:
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

4. Create a new folder called “LABS” by typing:
```
mkdir LABS
```
5. Import NPM packages by typing:
```
npm install azure-iot-device azure-iot-device-mqtt sensortag
```

#### Deploy your solution

1. Back on your laptop, open a new command/terminal window, hit **Shift+CTRL+C** if you don’t have one open. Make sure you are in the Bootcamp directory (eg. *C:\IOTBOOTCAMP*), where you saved the **PSCP.exe** file.
2. Type the following command to deploy your code to the **LABS** directory on the Device;
```
pscp -pw AzureIoT -r C:\IOTBOOTCAMP\LABS\lab1.js root@**[YOURDEVICE]**:/root/IOTBOOTCAMP/LABS
```
Change *[YOURDEVICE]* to the name of your Device. Make sure to update the path if you’re using a different directory.

#### Run the application
1. On the right side of the TI Sensor (with the logo facing you) you’ll find a power switch button. Press the button to turn on the sensor tag.
2. Go back to PuTTY and make sure you’re in the LABS folder.
3. Start the agent by typing:
```
node lab1.js
```
If all goes well you should read something like:
<pre>
<b>root@YOURDEVICE:~/IOTBOOTCAMP# node lab1.js</b>
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

Stream Analytics makes it easy to set up real-time analytic computations on data streaming from devices, sensors, web sites, social media, applications, infrastructure systems, and more.
Setting up a Stream Analytics job is simple, and can be done in three steps; Define Input, output and query

### Create job

1.	Back in the Azure Portal, Click **New** and type “stream” and click the “Stream Analytics job” option from the drop-down.
2.	Give the job a name, such as "ProcessingTelemetryData", select the subscription and choose the same *Resource Group* as with the IoT Hub (only for convenience when cleaning up). Click **Create**.
3.	Open the job after it has been successfully deployed.
4.	Click on Inputs

<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_4.png"/>

5.	Click **Add**, and give it a name (such as “temperatures”) and select IoT Hub as your Source:

<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_5.png"/>

6.	Click **Create**, and navigate back to your Stream Analytics job. – Click **Outputs**.
7.	Click **Add** and give it a name such as “powerbi”, set the sink to *Power BI*. Click Authorize and log in with your Office 365 account. 
If you have never used Power BI, you’ll have to enable your account by signing up. If you don’t have an O365 Account, let the trainer know and we’ll be creative 😉
8.	Set the Dataset- and Table Name to Temperatures 
9.	Again, click **Create**, and navigate back to your Stream Analytics job. – Click **Query**.
10.	Change *[YourOutputAlias]* to **powerbi** and *[YourInputAlias]* to **temperatures**
11.	Click **Save**, and go back to the job and Click **Start**.

### Create the report
You’re are finally ready to create your stunning report.

1.	Open a browser (if you’re are using a different account for Power BI, open up a new Incognito window) and navigate to http://powerbi.com and sign in with your O365 account.
2.	Click Streaming datasets and notice the temperatures data source. If it’s not there, make sure your device agent is running, or at least give it a minute or two. If it’s still not showing up, check the Steam Analytics Job for any errors
3.	Navigate to your Dashboard, and click Add tile in the upper-right corner.
4.	Select CUSTOM STREAMING DATA and click Next
5.	Select the Temperatures dataset and click Next
6.	Set the Visualization Type to Line chart, Axis to timestamp and set Values to temperature.
7.	Continue to give your tile a good name and subtitle.

#### Try it out

If you stopped your Device Agent, fire it up again. After 5-10 seconds you should see data presented on your power BI Dashboard.


## GET CREATIVE 

The whole idea with an IoT Bootcamp is to learn and get comfortable with the technology. Before you move on to the next lab, make your own changes and play around. Here are a few ideas you might consider:

### Change the payload
So far you have only been using temperatures, but the TI sensor tag has many other sensors. Visit the [sensortag NPM page]( https://www.npmjs.com/package/sensortag) and go bananas…

### Store your data in the cloud

Live streaming data to reports is all fine and dandy. But in many cases we’d like to persist the data for later analysis.  [Cosmo DB]( https://docs.microsoft.com/en-us/azure/cosmos-db/introduction) (previously known as Document DB) is a document database in Azure. Create a new database and update the Stream Analytics Job to push your sensor readings to the Cosmos collection. You can query the collection right from the Azure portal.
