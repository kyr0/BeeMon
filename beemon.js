var express = require('express'),
    app = express(),
    config = require('./config.json');

app.use(express.static(__dirname + '/public'));

app.get('/sensors', function (req, res) {
    res.send('TODO: Send latest sensors data');
});

var server = app.listen(config.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('BeeMon web interface is listening at http://%s:%s', host, port);
});
