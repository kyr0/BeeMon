var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/sensor/latest/:sensorId', function (req, res) {
    res.send('TODO: Send latest sensor value');
});

app.get('/sensor/stat/:sensorId', function (req, res) {
    res.send('TODO: Send sensor stats');
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('BeeMon web interface is listening at http://%s:%s', host, port);

    // Check if we are running as root
    // if so, drop privileges
    if (process.getgid() === 0) {
        process.setgid('nobody');
        process.setuid('nobody');
    }
});
