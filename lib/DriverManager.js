var udev = require('udev'),
    USBDeviceMonitor = udev.monitor();

/**
 * @class DriverManager
 * @singleton
 * Device driver management.
 */
var me = {

    /**
     * @prop {Object} drivers
     * Lookup map describing drivers available.
     * Key is product family matcher.
     */
    drivers: {

        'TEMPer1': require('./driver/TEMPer1.js')
    },

    /**
     * Initializes device driver management
     */
    init: function() {

        // register udev subsystem event callbacks
        USBDeviceMonitor.on('add', me.onDeviceAttached);
        USBDeviceMonitor.on('remove', me.onDeviceDetached);
        USBDeviceMonitor.on('change', me.onDeviceChanged);
    },

    /**
     * Gets called when a device gets attached to the USB host controller
     * @param {Object} deviceDescriptor USB device description
     */
    onDeviceAttached: function(deviceDescriptor) {

        //console.log('sensor/actor attached ', deviceDescriptor);

        // lookup driver
        var deviceDriver = me.lookupDriver(
            deviceDescriptor.ID_MODEL,
            deviceDescriptor.ID_VENDOR_ID
        );

        if (deviceDriver) {

            console.log('[ok] [' + deviceDriver.category + '] Device driver found : ', deviceDriver.productFamily);

            // mount devices
            deviceDriver.mount(
                me.onDeviceMounted,
                me.onDeviceUnmounted
            );
        }
    },

    /**
     * Gets called when a device gets detached to the USB host controller
     * @param {Object} deviceDescriptor USB device description
     */
    onDeviceDetached: function(deviceDescriptor) {
        //console.log('sensor/actor detached ', deviceDescriptor);
    },

    /**
     * Gets called when a device gets changed on the USB host controller
     * @param {Object} deviceDescriptor USB device description
     */
    onDeviceChanged: function(deviceDescriptor) {
        //console.log('sensor/actor changed ', deviceDescriptor);
    },

    /**
     * Filters the drivers map for a suitable driver.
     * Returns
     * @param model
     * @param vendorId
     */
    lookupDriver: function (model, vendorId) {

        // cast from hex
        vendorId = parseInt(vendorId, 16);

        // dynamic driver lookup
        for (var family in me.drivers) {

            if (model.indexOf(family) > -1 &&
                me.drivers[family]['vendorId'] === vendorId) {

                return me.drivers[family];
            }
        }
        return false;
    },


    onDeviceMounted: function (deviceDescriptor) {

    },


    onDeviceUnmounted: function () {

    }
};

// export
module.exports = me;