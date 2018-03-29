'use strict';

const co = require('co');
const AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
const Lambda = new AWS.Lambda();

let functions = [];

let listFunctions = co.wrap(function* (marker, acc) {
    acc = acc || [];

    let resp = yield Lambda.listFunctions({
        Marker: marker,
        MaxItems: 100
    }).promise();

    let functions = resp.Functions
        .map(f => f.FunctionName)
        .filter(fn => fn.includes("aws-coldstart-" + process.argv[2]) && !fn.endsWith("run"));

    acc = acc.concat(functions);

    if (resp.NextMarker) {
        return yield listFunctions(resp.NextMarker, acc);
    } else {
        return acc;
    }
});

let run = co.wrap(function* () {
    if (functions.length == 0) {
        console.log("fetching relevant functions...");

        functions = yield listFunctions();
        console.log(`found ${functions.length} functions`);
    }

    console.log("invoking $LATEST...");
    for (let func of functions) {

        //Lambda.invoke()
        Lambda.invoke({
            FunctionName: func,
            InvocationType: "Event"
        }, function (err, data) {
            if (err) console.log("Invocation Error: " + func); // an error occurred
            else console.log("Invocation Success: " + func); // successful response
        });
    }
});

run();
