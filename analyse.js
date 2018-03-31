// set this to your plot.ly account
const username = process.env.USERNAME;
const api_key = process.env.API_KEY;

const _ = require('lodash');
const co = require('co');
const Promise = require('bluebird');
const plotly = require('plotly')(username, api_key);
const fs = Promise.promisifyAll(require("fs"));
const math = require('mathjs');
const Stats = require('fast-stats').Stats;

let readStats = co.wrap(function* () {
    let contents = yield fs.readFileAsync('result.csv', 'utf-8');

    contents = contents.slice(0, -1);
    let rows = contents
        .split('\n')
        //.filter(str => str.match(/aws-coldstart-(\w+\w*)-dev-memory-(\d+\d*)/i))
        .map(str => {
            let parts = str.split(',');

            if (parts.length < 2) {
                return {};
            } else {
                //let funcName = parts[0];
                //let matchRes = funcName.match(/aws-coldstart-(\w+\w*)-dev-memory-(\d+\d*)/i);

                let lang = parts[0];
                let memorySize = parseInt(parts[1]);

                //console.log(parts);


                return {
                    function: parts[0],
                    lang: lang,
                    memorySize: memorySize,
                    value: parseFloat(parts[2])
                };
            }

            //process.exit();
        });

    return rows;
});

let calcStats = co.wrap(function* () {
    let rows = yield readStats();

    // console.log(rows);

    let byLangSize = _.groupBy(rows, r => `${r.lang}-${r.memorySize}MB`);

    // console.log(byLangSize);

    let statsByLangSize = _.mapValues(
        byLangSize,
        rs => {
            let values = rs.map(r => r.value);
            let stats = new Stats();
            // console.log(values);

            stats.push(values);

            return {
                lang: rs[0].lang,
                memorySize: rs[0].memorySize,
                stddev: math.std(values),
                mean: math.mean(values),
                median: math.median(values),
                '95%-tile': stats.percentile(95),
                '99%-tile': stats.percentile(99),
                min: math.min(values),
                max: math.max(values)
            };
        });

    console.log('lang,memory size,std dev,mean,median,95%-tile,99%-tile,min,max');
    for (let x of _.values(statsByLangSize)) {
        console.log(`${x.lang},${x.memorySize},${x.stddev},${x.mean},${x.median},${x['95%-tile']},${x['99%-tile']},${x['min']},${x['max']}`);
    }
});

// boxPlot();
calcStats();
