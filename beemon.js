var express = require('express'),
    app = express(),
    config = require('./config.json');

// serve static files
app.use(express.static(__dirname + '/public'));

// GET /sensors
// Delivers all sensor device descriptions together with
// their latest and statistical data
app.get('/sensors', function (req, res) {

    res.json({
        devices: {
            temperature: [{
                id: 's1',
                name: 'Sensor 1',
                deviceType: 'TEMPer1F',
                deviation: 1,
                latestValue: 34,
                stats: [
                    [1147651200000,67.79],
                    [1147737600000,64.98],
                    [1147824000000,65.26],
                    [1147910400000,63.18],
                    [1147996800000,64.51],
                    [1148256000000,63.38],
                    [1148342400000,63.15],
                    [1148428800000,63.34],
                    [1148515200000,64.33],
                    [1148601600000,63.55],
                    [1148947200000,61.22],
                    [1149033600000,59.77]
                ]
            }, {
                id: 's2',
                name: 'Sensor 2',
                deviceType: 'TEMPer1F-Pro',
                deviation: 0.1,
                latestValue: 35.21,
                stats: [
                    [1149120000000,62.17],
                    [1149206400000,61.66],
                    [1149465600000,60.00],
                    [1149552000000,59.72],
                    [1149638400000,58.56],
                    [1149724800000,60.76],
                    [1149811200000,59.24],
                    [1150070400000,57.00],
                    [1150156800000,58.33],
                    [1150243200000,57.61],
                    [1150329600000,59.38],
                    [1150416000000,57.56],
                    [1150675200000,57.20],
                    [1150761600000,57.47],
                    [1150848000000,57.86],
                    [1150934400000,59.58],
                    [1151020800000,58.83],
                    [1151280000000,58.99],
                    [1151366400000,57.43],
                    [1151452800000,56.02],
                    [1151539200000,58.97],
                    [1151625600000,57.27]
                ]
            }],
            weight: []
        }
    });
});

// GET /sensor/assign/:sensorId/:sensorName
// Sets a name for a specific sensor id.
// This name is returned in GET /sensors request.
app.get('/sensor/assign/:sensorId/:sensorName', function (req, res) {

    res.json({
        success: true
    });
});

// start listening
var server = app.listen(config.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('BeeMon web interface is listening at http://%s:%s', host, port);
});
