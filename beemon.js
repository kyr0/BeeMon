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
                stats: []
            }, {
                id: 's2',
                name: 'Sensor 2',
                deviceType: 'TEMPer1F-Pro',
                deviation: 0.1,
                latestValue: 35.21,
                stats: []
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
