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

    var i, j;
    var now = new Date;
    let tags = [{tag: 'Humidity', value: 60.0},
                {tag: "LIGHT_LEVEL", value: 2},
                {tag: "MOTION_SENSOR", value: false},
                {tag: "OCCUPANT_TEMPERATURE", value: 17.0},
                {tag: "SOUND_LEVEL", value: 29}];

    for(i = 0; i < messageCount; i++)
    {
        let ct = now.toLocaleString('en-US');
        for(j = 0; j < tags.length; j++)
        {
            let value = 0;
            if(typeof tags[j].value === "boolean"){
                value = now.getHours() > 8 ? 1 : 0;
            }
            if(typeof tags[j].value === "number"){
                value = tags[j].value % 1 === 0 
                ? tags[j].value + Math.random() * 10
                : tags[j].value + Math.random();
                value = value.toFixed(2);
            }

            var body = {
                t: ct,
                id: tags[j].tag,
                v: value,
                s: "15s"
            };
            
            var messageBody = JSON.stringify(Object.assign({}, body));
            var messageBytes = Buffer.from(messageBody, "utf-8");

            var message = new Message(messageBytes);        
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
    }

    context.log('Device Simulator message sending is completed!', timeStamp);
}