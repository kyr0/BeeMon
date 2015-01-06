Beemon.Sensors = {

    _interval: null,

    /**
     * Delay in seconds
     */
    delay: 5,

    activated: {

    },

    sensors: {

    },

    sensorCategories: {

    },

    rendered: false,

    /**
     * Starts the sensor data fetching interval
     */
    launch: function() {

        this._interval = setInterval(this.fetchData, this.delay * 1000);

        // initial fetch
        this.fetchData();

        // register click handler for sensor rename buttons
        $('.sensorNameButton').click(this.onRenameButtonClick);
    },

    /**
     * Renders the highcharts initially
     */
    preRenderCharts: function (category) {

        //console.log('preRenderCharts', category);

        Highcharts.setOptions({
            lang: {
                // TODO: i18n
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',  'Juli', 'August',
                         'September', 'Oktober', 'November', 'Dezember'],
                weekdays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
                decimalPoint: ',',
                loading: 'Lade',
                numericSymbols: [ "Tsd" , "Mio" , "Mrd" , "Bio" , "Bil" , "Tri"],
                printChart: 'Drucken',
                rangeSelectorFrom: 'Von',
                rangeSelectorTo: 'Bis',
                rangeSelectorZoom: 'Filter',
                resetZoom: 'Zurück',
                thousandsSep: '.',
                downloadJPEG: 'Download JPG',
                downloadPDF: 'Download PDF',
                downloadPNG: 'Download PNG',
                downloadSVG: 'Download SVG',
                contextButtonTitle: 'Weiteres',
                noData: 'Aktuell ist keine Historie bekannt.'

            }
        });

        var chartBox = $('.container.' + category + ' .chart');

        //console.log('chartBox', chartBox);

        // Create the chart
        chartBox.highcharts('StockChart', {

            colors: ['#c09100', '#c09100', '#c09100', '#c09100', '#c09100', '#c09100', '#c09100'],

            chart: {
                zoomType: 'x',
                height: 300,
                borderColor: '#808080',
                selectionMarkerFill: 'rgba(255, 218, 91, 0.44)'
            },

            rangeSelector : {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                inputEnabled: false, // it supports only days
                selected : 4 // all
            },

            exporting: {
                buttons: {
                    contextButton: {
                        theme: {
                            'stroke-width': 0,
                            r: 0,
                            states: {
                                hover: {
                                    fill: '#fff'
                                },
                                select: {
                                    stroke: '#fff',
                                    fill: '#fff'
                                }
                            }
                        }
                    }
                }
            },

            xAxis : {
                minRange: 3600 * 1000 // one hour
            },

            yAxis: {
                floor: 0,
                /*title: {
                    text: 'Temperature (°C)'
                },
                */
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },

            tooltip: {
                valueSuffix: this.getValueSuffixForCategory(category)
            },

            navigator: {
                maskFill: 'rgba(255, 218, 91, 0.10)',
                outlineColor: '#808080',
                series: {
                    color: 'rgba(100, 100, 100, 0.20)',
                    dataGrouping: {
                        smoothed: false
                    },
                    lineWidth: 2,
                    lineColor: '#555'
                }
            },

            scrollbar: {
                barBackgroundColor: '#eee',
                buttonBackgroundColor: '#eee'
            },

            series : [{
                name: '',
                data : [],
                type: 'spline',
                tooltip: {
                    valueDecimals: 2
                },
                dataGrouping: {
                    enabled: false
                }
            }]
        });
    },

    getValueSuffixForCategory: function(category) {

        switch (category) {

            case 'temperature':
                return ' °C';

            case 'weight':
                return ' kg';
        }
    },

    /**
     * Fetches the sensors data
     */
    fetchData: function() {

        $.ajax({
            url: "/sensors"
        }).done(function(sensorData) {

            Beemon.Sensors.updateModel(sensorData);
            Beemon.Sensors.render(sensorData);
        });
    },

    /**
     * Update local sensor data model
     * @param {Object} sensorData Sensor data
     */
    updateModel: function(sensorData) {

        // render toggle buttons by category, sensor devices
        var sensorDevices,
            sensorDevice,
            sensorCategoryUnknown;

        // 0. update client-side model of sensors
        for (var categoryName in sensorData.devices) {

            sensorCategoryUnknown = false;
            sensorDevices = sensorData.devices[categoryName];

            if (!this.sensorCategories[categoryName]) {

                sensorCategoryUnknown = true;

                this.sensorCategories[categoryName] = sensorData.devices[categoryName];
            }

            for (var i=0; i<sensorDevices.length; i++) {

                sensorDevice = sensorDevices[i];

                // merge category field with sensor object for shortcut-lookup in 2.
                sensorDevice.category = categoryName;

                if (!this.sensors[sensorDevice.id]) {
                    this.sensors[sensorDevice.id] = sensorDevice;
                }

                // auto-activate the first sensor in category
                // if the category was unknown before
                if (sensorCategoryUnknown && i==0) {
                    this.activated[sensorDevice.id] = sensorDevice;
                    sensorCategoryUnknown = false;
                }
            }
        }
    },

    /**
     * Renders
     * @param sensorData
     */
    render: function(sensorData) {

        var sensorDevices,
            sensorDevice,
            categorySensorButtonToolbar,
            sensorButtonsMarkup,
            sensorActive;

        // 1. create/update UI for each category
        for (var categoryName in sensorData.devices) {

            sensorDevices = sensorData.devices[categoryName];
            categorySensorButtonToolbar = $('.container.' + categoryName + ' .sensorButtons');
            sensorButtonsMarkup = '';

            if (sensorDevices.length && sensorDevices.length > 0) {

                for (var i=0; i<sensorDevices.length; i++) {

                    sensorDevice = sensorDevices[i];
                    sensorActive = '';

                    if (this.isActive(sensorDevice.id)) {
                        sensorActive = 'active';
                    }

                    // add the sensor buttons elements
                    sensorButtonsMarkup += '<button type="button" class="btn btn-default btn-xs ' + sensorActive + '" '
                    +         'data-sensor-id="' + sensorDevice.id + '">'
                    +     sensorDevice.name
                    + '</button>'
                }

                // update sensor button markup
                categorySensorButtonToolbar.html(sensorButtonsMarkup);

            } else {

                categorySensorButtonToolbar.html('&ndash; ohne Sensoren &ndash;');
            }

            // register click handler for each sensor button
            $('.container.' + categoryName + ' .sensorButtons button').click(this.onSensorButtonClick);

            // first render cycle: prepare charts
            if (!this.rendered) {
                this.preRenderCharts(categoryName);
            }
        }

        // 2. Update data by category
        for (var categoryName in sensorData.devices) {

            var activeSensor = this.getActiveSensorInCategory(categoryName);

            this.renderSensorData(activeSensor, categoryName);
        }

        // set flag
        this.rendered = true;
    },

    getChartByCategory: function (category) {
        return $('.container.' + category + ' .chart').highcharts();
    },

    /**
     * Renders sensor data for a specific sensor
     * @param sensor
     * @param category
     */
    renderSensorData: function (sensor, category) {

        var sensorRenameButton = $('.' + category + ' .sensorNameButton'),
            chart = this.getChartByCategory(category);

        // update sensor stats and latest value
        if (sensor) {

            //console.log('Render data for: ', sensor, category);

            $('.' + category + ' .currentValueBox').html(
                this.renderNumber(sensor.latestValue)
            );

            $('.' + category + ' .deviationValueBox').html(
                this.renderNumber(sensor.deviation)
            );

            $('.' + category + ' .deviceTypeValueBox').html(
                this.renderNumber(sensor.deviceType)
            );

            $('.' + category + ' .sensorNameBox').html(
                this.renderNumber(sensor.name)
            );

            if (sensorRenameButton.hasClass('disabled')) {
                sensorRenameButton.removeClass('disabled');
            }

            chart.series[0].name = sensor.name;
            chart.series[0].setData(sensor.stats);

        } else {

            // update with empty data / message
            //console.log('Render NO data for: ', sensor, category);

            $('.' + category + ' .currentValueBox').html('&ndash;');

            $('.' + category + ' .deviationValueBox').html('&ndash;');

            $('.' + category + ' .deviceType').html('&ndash;');

            $('.' + category + ' .sensorNameBox').html('&ndash;');

            if (!sensorRenameButton.hasClass('disabled')) {
                sensorRenameButton.addClass('disabled');
            }

            chart.series[0].setData([]);
        }
    },

    renderNumber: function(sensorValue) {

        // TODO: Localized number rendering, currently de_DE only.
        return String(sensorValue).replace('.', ',');
    },

    /**
     * Checks if a sensor is
     * @param checkSensorId
     * @returns {boolean}
     */
    isActive: function(checkSensorId) {

        var sensorActive = false;

        for (var sensorId in this.activated) {

            if (this.activated.hasOwnProperty(sensorId) &&
                this.activated[checkSensorId]) {

                sensorActive = true;
            }
        }
        return sensorActive;
    },

    /**
     * Returns the active sensor of the category named
     * @param {String} categoryName Name of the category
     * @return {Object}
     */
    getActiveSensorInCategory: function (categoryName) {

        var sensor = null;
        for (var sensorId in this.activated) {

            if (this.activated.hasOwnProperty(sensorId) &&
                this.isActive(sensorId) &&
                this.activated[sensorId].category == categoryName) {

                sensor = this.activated[sensorId];
            }
        }
        return sensor;
    },

    /**
     * Activates the sensor clicked and renders it's data
     */
    onSensorButtonClick: function (clickEvent) {

        //console.log('onSensorButtonClick', clickEvent.currentTarget);

        var self = Beemon.Sensors;

        // lookup data of new active sensor
        var newActiveSensorId = $(clickEvent.currentTarget).data('sensor-id');

        //console.log('newActiveSensorId', newActiveSensorId);

        var newActiveSensor = self.sensors[newActiveSensorId];

        //console.log('newActiveSensorData', newActiveSensor);

        // set new active sensor in model
        var currentActiveSensor = self.getActiveSensorInCategory(newActiveSensor.category);

        // in-activate current active sensor in category
        delete self.activated[currentActiveSensor.id];

        // activate new active sensor in category
        self.activated[newActiveSensor.id] = newActiveSensor;

        // render current active sensor button inactive
        var currentActiveSensorElement = $('button[data-sensor-id=' + currentActiveSensor.id + ']');
        currentActiveSensorElement.removeClass('active');

        // render new active sensor button active
        var newActiveSensorElement = $('button[data-sensor-id=' + newActiveSensor.id + ']');
        newActiveSensorElement.addClass('active');

        // reset any chart zoom
        var chart = self.getChartByCategory(newActiveSensor.category);
        chart.xAxis[0].setExtremes(
            Date.UTC(1970, 0, 0),
            Date.now()
        );

        // render sensor data for category
        self.renderSensorData(newActiveSensor, newActiveSensor.category);
    },

    /**
     * Prompts for a new name of the currently active sensor in category
     * @param clickEvent
     */
    onRenameButtonClick: function (clickEvent) {

        //console.log('onRenameButtonClick', clickEvent);

        var newSensorName = prompt('Neuer Sensor-Name:');

        //console.log('newSensorName', newSensorName);

    }
};

// launch module
Beemon.Sensors.launch();