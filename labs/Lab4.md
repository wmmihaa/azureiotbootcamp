# Introduction to Node.js
# Lab 4 – Device Management
## Description
From a functional perspective, everything you’ve done so far works as expected. However, in the real world we face problems and issues. Fixing and managing these issues can be challenging when the device is deployed to a remote location.

Devices are in many aspects no different other computers and servers. For instance, it has a operating system that periodically needs to get patched. Same goes for NPM packages we install to communicate with Azure IoT Hub or sensors. They are no different in that they to get security updates, fixes etc. Last of, your colleagues (not you obviously) probably end up writing bugs occasionally…

All this brings the need for IoT Operation and Device Management. In this lab you’re going to work with a tool called **microServiceBus.com**. microServiceBus.com is not an IoT Hub, but device management for other IoT Hubs such as Azure IoT Hub.

The lab is going to be identical to Lab 1, but delivered using microServiceBus.com, only to give you an idea of managing your IoT solution in a professional way.

<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_3.png"/>

## Setup

### Set up the your organization in microServiceBus.com

An organization is a where all your devices, or nodes as they are called, are managed. You will automatically be assigned as owner of your organization, and you can later add other people to your organization to share you work.


1. Navigate to [www.microServiceBus.com](https://microservicebus.com) and click the “**Register**” button in the upper right corner. 
2. Fill out your details, accept the terms and conditions and click “**Register**”. 
3. Check your mail box, open the confirmation mail and click the “**Register**” link. 
4. Log in to the microServiceBus.com site using the credentials you supplied in step 2. 
5. Select "Option 2. Use my Microsoft Azure IoT Hub, and provide a **iothubowner** for your Azure IoT Hub. 
6. Uncheck the “*Add sample scenarios*” checkbox and click *Create organization* 

### Download the device package
Your organization is now linked with your Azure IoT Hub, and the devices you’ve created in earlier labs are should now be accessable from the [Nodes page](https://microservicebus.com/Nodes)

But before we begin, we need to install the *microservicebus.node* package.

*Using PuTTY, navigate to the IOTBOOTCAMP folder on your Raspberry PI and type:*
```
mkdir msb
```
Install the npm package by typing:
```
npm install microservicebus.node
```

This step will now install an NPM package which will serve as our generic device application. Don't wait for the the package to complete, just continue with the exercise.

## Exersice

### Create a node
In the microServiceBus portal, a **Node** referes to the _gateway_ or _agent_ application that will run on the device. The “node” is responsible for interacting with the sensors attached to the device and also understands how to communicate with your *IoT Hub*.

1. Navigate to the [Nodes]( https://www.microservicebus.com/Nodes) page using the menu on the upper left corner.
2. Your nodes should now be visible in the list. 

With the NPM papckage installed, -it’s time to start it up. The NPM package you installed earlier is a generic client which hasn’t been given credentials to log in to your organization. To initiate the node…

1. Still on the Nodes page, click the “**Generate**” button to receive a temporary code.
2. Open a new terminal window and type: **node start -c [YOUR CODE] -n [NAME OF NODE]**
```js
eg node start -c ABC123 -n device1
```

The node should startup with no errors:

<img src="http://microservicebus.blob.core.windows.net/sample/hol7_node.jpg" alt="Drawing" style="height: 100px;"/>

*Please note that no services are started.*

### Create a flow
A **Flow** is where different devices can interact, sending messages from one device to another. This is done using **Services**. A *Service* is essentially a piece of software (JavaScript in this case) that does something useful, such as reading a sensor, saving a file or transforming a message. 

Begin with navigating to the **Flow page**, and click the **Create new** button. Give it a name, such as *Transmit Sensor data*.

After the *Flow* has been created, a flow designer will appear. On the left you’ll see *Services* grouped in **Inbound-**, **Outbound-** and **Other Services**. *Inbound* services are services that starts the flow, such as reading off a sensor. *Outbound* services are generally sending data somewhere else, as to a database. Sometime you need to write some custom script for which you can find the *Script* service among the *Other Services* category.

The scenario you’re going to build the exact same solution as you did in **LAB 1 - Submitting telemetry data to the cloud**, deading and submitting temperature data to the IoT Hub.

1. Start out by dragging a **TI SimpleLink** service from the toolbox (*Inbound*) to the designer canvas.
2. Next drag an **Azure IoT Events** (*Outbound*) service to the right of the TI Sensor service.
<img src="http://microservicebus.blob.core.windows.net/img/azurebootcamp_14.png"/>



#### Configure the Services
A *Service* can run on ANY node, although in our case they’ll all run on the same one. Later, if you have time you can add more nodes and set each service to run on different ones. 

##### Configure TI the *SimpleLink* service
1. Double-click on *TI SimpleLink* service on the designer
2. In the *General tab*, set the **Node** property to the name of your device/node. Eg "device1".
3. in the *Static Properties* tab, uncheck all sensors but **Temperature**, and set the interval to 5.
4. Click the **Ok** to close.

##### Configure the *Azure IoT Event* service
1. Double-click on *TI SimpleLink* service on the designer
2. In the *General tab*, set the **Node** property to the name of your device/node. Eg "device1".
3. Click the **Ok** to close

Save the script by clicking the "Save" button. 

Note that your device/node is getting restarted, and both services has been downloaded to the device and got started.

Your solution should now work the same way as it did in Lab 1. But your are now able to start/stop the device/node from the node page. 

## GET CREATIVE 
* Try the remote debugging accessable from the *Action* button on the node (on the Node page)
* Enable tracking on the node, and examine the output from the [Management page](https://microservicebus.com/Instrumentation).
* From the [Script & Services page](https://microservicebus.com/Files), create a new service by copying the TI SensorLink. Make some changes and save. You Service should now be available from the toolbox on the Flow page. Update the flow, save, and your service should get deployed to the PI.


