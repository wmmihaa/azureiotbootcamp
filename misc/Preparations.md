## Preparations
### Get Devices
Microsoft was very helpful lending us devices and sensors. Ping me for contacts...
We used Raspberry PI 3 model B together with a TI sensor tag from Texas Instrument.

### Install and setup
#### Prepare image
To simply setup, the easiest option is to install one Raspberry PI and then copy the SD card using for instance [Win32 Disk Imager](https://sourceforge.net/projects/win32diskimager/). 

1. Install OS (We used NOBS/Raspian).
2. Install node.js
```
wget https://nodejs.org/dist/v7.7.2/node-v7.7.2-linux-armv7l.tar.gz  
tar -xvf node-v7.7.2-linux-armv7l.tar.gz  
cd node-v7.7.2-linux-armv7l
```
3. Install TI Sensor Tag. Use [this guide](https://developer.ibm.com/recipes/tutorials/ti-sensor-tag-and-raspberry-pi/) **BUT STOP AT STEP 3 (don't pair)**
4. Set WIFI network
5. Create image and copy to all SD cards

#### Configure all devices
1. Insert an SD card into a PI
2. Attach screen, keyboard and mouse 
3. Rename the PI (*../../etc/hostname*)
3. Set the WIFI, reboot
4. Install samba (for DNS only)
```
> sudo apt-get install samba
```
5. Pair TI sensor
```
> sudo hcitool lescan
... copy the MAC adress
> gatttool -b [insert mac] -I
```
6. Shutdown, detatch and move on to next device



