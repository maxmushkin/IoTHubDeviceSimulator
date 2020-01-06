'use strict';

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;

var connectionString = process.env["AzureIoTHubDeviceConnectionString"];
var messageCount = process.env["AzureIoTHubDeviceMessageCount"] || 1;

module.exports = async function (context, myTimer) {
    context.log('IoTHub Device Simulator started.');
    context.log(messageCount);
    var timeStamp = new Date().toISOString();

    if(!connectionString || 0 === connectionString.length){
        context.log("IoT Device Connection String is not configured!");
        return;
    }   
    
    var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

    var i;
    for(i = 0; i < messageCount; i++)
    {
        var message = new Message(JSON.stringify({
            timestamp: new Date().getTime(),        
            gwy:"b121IoTWorx",
            name:"Device_1210101_AV_" + i,
            value: 10 + (Math.random() * 20),
            tag: "DEGREES-FAHRENHEIT"
          }));

        message.properties.add('encoder', 'b121encoder');
        message.properties.add('deviceId', 'IoTWorXb121gwySim');
    
        // Send the message.
        client.sendEvent(message, function (err) {
            if (err) {
            console.error('send error: ' + err.toString());
            } else {
            console.log('message sent');
            }
        });
    }

    context.log('Device Simulator message sending is completed!', timeStamp);
}