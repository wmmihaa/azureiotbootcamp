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
