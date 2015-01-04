Beemon.Sensors = {

    /**
     * Delay in seconds
     */
    delay: 5,

    /**
     * Starts the sensor data fetching interval
     */
    launch: function() {

        this.interval = setInterval(this.fetchData, this.delay * 1000);

        // initial fetch
        this.fetchData();
    },

    /**
     * Fetches the sensors data
     */
    fetchData: function() {

        $.ajax({
            url: "/sensors"
        }).done(function(sensorData) {

            Beemon.Sensors.updateData(sensorData);
        });
    },

    /**
     * Update sensors data
     * @param {Object} sensorData Sensor data
     */
    updateData: function(sensorData) {

        // render toggle buttons by category, sensor devices
        var sensorDevices,
            categorySensorButtonToolbar,
            sensorButtonsMarkup,
            sensorDevice,
            sensorActive;

        // for each category...
        for (var categoryName in sensorData.devices) {

            sensorDevices = sensorData.devices[categoryName];
            categorySensorButtonToolbar = $('.container.' + categoryName + ' .sensorButtons');
            sensorButtonsMarkup = '';


            if (sensorDevices.length && sensorDevices.length > 0) {

                for (var i=0; i<sensorDevices.length; i++) {

                    sensorDevice = sensorDevices[i];
                    sensorActive = '';

                    if (i==0) {
                        sensorActive = 'active'
                    }

                    // add the sensor buttons elements
                    sensorButtonsMarkup += '<button type="button" class="btn btn-default btn-xs ' + sensorActive + '">'
                                         + sensorDevice.name
                                         + '</button>'
                }

                // update sensor button markup
                categorySensorButtonToolbar.html(sensorButtonsMarkup);

            } else {

                categorySensorButtonToolbar.html('<center>Keine Sensoren gefunden :-(</center>');
            }
        }
    }
};

// launch module
Beemon.Sensors.launch();