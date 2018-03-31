'use strict';

const _ = require('lodash');
const co = require('co');
const Promise = require('bluebird');
var sleep = require('sleep');
const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';

var cloudwatchlogs = new AWS.CloudWatchLogs();

var params = {
    //limit: 100,
    logGroupNamePrefix: '/aws/lambda/aws-coldstart',
    //nextToken: 'STRING_VALUE'
};
cloudwatchlogs.describeLogGroups(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
        //console.log(data.logGroups.length); // successful response

        for (var i = 0; i < data.logGroups.length; i++) {
            fetchEvents(data.logGroups[i].logGroupName);
        }
    }
});

let fetchEvents = co.wrap(function* (groupName, marker) {
    // acc = acc || [];

    var params = {
        logGroupName: groupName,
        //        endTime: 0,
        filterPattern: 'Billed Duration',
        interleaved: true,
        limit: 10000,
        //  logStreamNames: [
        // 'STRING_VALUE',
        // ],
        nextToken: marker,
        //startTime: 0
    };

    let resp = yield cloudwatchlogs.filterLogEvents(params).promise();

    var grParts = groupName.split('-');

    var runtime = grParts[2];

    for (var j = 0; j < resp.events.length; j++) {
        var msg = resp.events[j].message;
        var msgParts = msg.split('\t');
        //console.log(msg);

        var memoryAllocated = msgParts[3].replace('Memory Size: ', '').replace(' MB', '');
        var duration = msgParts[1].replace('Duration: ', '').replace(' ms', '');
        var memoryUsed = msgParts[4].replace('Max Memory Used: ', '').replace(' MB', '');
        var timestmp = resp.events[j].timestamp;

        console.log(runtime + ',' + memoryAllocated + ',' + duration + ',' + memoryUsed + ',' + timestmp);
    }

    sleep.sleep(1);

    //console.log(resp.events[0].message);

    // process.exit();

    if (resp.nextToken) {
        fetchEvents(groupName, resp.nextToken);
    } else {
        //return acc;
    }
});
