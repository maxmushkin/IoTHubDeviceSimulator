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
    var now = new Date;
    for(i = 0; i < messageCount; i++)
    {
        var body = {
            id:"Device" + i,
            m:"Occupant_temperature",
            v: 60 + (Math.random() * 20),
            q: true,
            t: now.toLocaleString('en-US')
          };
                
        var messageBody = JSON.stringify(Object.assign({}, body));
        var messageBytes = Buffer.from(messageBody, "utf-8");

        var message = new Message(messageBytes);
        
        // Define this properties is required for proper message decoding to automatic IoTHub routing to the blob storage, otherwise message body is BASE64 encoded
        message.contentType = 'application/json';
        message.contentEncoding = 'utf-8';

        context.log(messageBody);
    
        // Send the message.
        client.sendEvent(message, function (err) {
            if (err) {
            console.error('send error: ' + err.toString());
            } else {
            console.log('message sent' + message);
            }
        });
    }

    context.log('Device Simulator message sending is completed!', timeStamp);
}