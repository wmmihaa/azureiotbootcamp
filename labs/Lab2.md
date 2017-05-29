# LAB 1 - Pushing telemetry data to Power BI

## Description
In the previous lab your Device (Raspberry PI) played the role of the temperature gateway. The Bluetooth sensor has a 50-60m range, and we can imagen several sensors paired with the same gateway. In this lab you’re going to add another device playing the role of the air condition or thermostat. For this device, you are going to be using your laptop. 

Your Raspberry PI device is going to continue sending data to the cloud. However, if the temperature exceeds a certain threshold, the Laptop device is going to be notified and adjust the AC. Unless your laptop already comes attached with an air-condition, - we’re going to simulate the last step by just printing messages to the console/terminal.

These new features will require you to familiarize yourself with some additional members of the Azure family, namely Azure Service Bus and Azure Functions.


<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_6.png"/>

## Get started

### Setup Azure Service Bus
Azure Service Bus is all about connectivity and give you the possibility of creating **Queues**, **Topiccs**, **Relays** and more. But all we need for this lab is a simple *Queue*.

1. Log in to the [Azure Portal](https://portal.azure.com/)
2. Click **New** and type "service bus", click the "Serice Bus" option from the drop-down  
<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_7.png"/>
3. Select *Service Bus* from the list and click **Create** to create a new Service Bus namespace.
4.	Give your Service Bus namespace a **Name** and click **Create** after selecting Resource group and Location (North- or West Europe). 
5. Wait for the namespace to be created and browse to it from the Resource Group.
6. Add a new **Queue** by clicking the "+" sign at the top of the blade:
<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_8.png"/>
7. Give the *Queue* a name, such as "temperaturereadings".
8. Leave all other settings and click **Create**
9. From the Service Bus namespace, select the *Share access policies* option on the left:
<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_9.png"/>
10. Click the *RootManageSharedAccessKey* and copy the **CONNECTION STRING–PRIMARY KEY**. Save the key as you're going to use it later.

In the last step of this exercise you forward messages to the queue by updating the Azure Stream Analytics Job you created in Lab1. But before we do that, we need to create an Azure Function and register a new device.

### Create Azure Function
Azure Functions is about "Serverless computing" and can be used in many different scenarios. In our case we're going to use it to off-load messages from the Queue and send notification messages to to the laptop device.

1. In the [Azure Portal](https://portal.azure.com/), click the "+" sign in the upper left corner and type **"Function App"** in the search field. Select **Function App** from the list and click **Create**.
2. Give the *Function App* a name. Select the same *Resource group* and set *Location* to "North Europe". 
3. Wait until the deployment is complete and open the *Function App* by navigating to your *Resource group*.
4. Click the "+" sign next to *"Functions"* and the **Custom function**
<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_10.png"/>
5. Select *JavaScript* as the Language and **ServiceBusQueueTrigger-JavaScript** as the template
6. Set the **Name** to "sendMessageToDevice" 
7. Create a new *Service Bus connection* by clicking **new** and use the connection string you copied after creating the Service Bus namespace. 
8. Set *Access rights* to **Listen** and click the **Create** button.

### Write Azure Function
With the *Function* created, it's time to write the actual code. Replace the existing function code with:

```js
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
```

### Register the new laptop device

1. Go back to your IoT hub, click **Device Explorer** and add a new device. Give it a name (eg "device2"), and copy and save the *Connection string".
2.  While in the IoT Hub, click *Shared access policies* and copy the connection string of the **Service** policy.
3. Go back to the function and update the connection string line 6.
4. Using VS Code, create a new file called **lab2.js**
5. Copy the code from the lab1.js file and make the following changes:
* Remove the referense to the SensorTag at the top
* Change the connection string to the device connection string you copied priviously.
* Remove the call to the **setUpSensor**
* Remove the **setUpSensor** function

You should now have a "clean" IoT agent with nothing but connecting to the IoT Hub. As we said before, this device (your laptop) will only RECEIVE messages and never send.

Add the follwoing code just after you successfully connected to the IoT Hub.





