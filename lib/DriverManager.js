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
     * Key is unique USB device vendor+model identifier.
     */
    drivers: {

        '0c45-7401': {
            family: 'TEMPer1',
            category: 'temperature',
            interface: require('./driver/TEMPer1.js')
        }
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
            deviceDescriptor.ID_VENDOR_ID,
            deviceDescriptor.ID_MODEL_ID
        );

        if (deviceDriver) {

            console.log('[ok] Device driver found [' + deviceDriver.category + ']: ', deviceDriver.family);

            if (deviceDriver.interface) {

                console.log('[ok] Mounting device.');

                // mount device
                deviceDriver.interface.mount(
                    deviceDescriptor,
                    me.onDeviceMounted,
                    me.onDeviceUnmounted
                );
            }
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
     * @param vendorId
     * @param modelId
     */
    lookupDriver: function (vendorId, modelId) {

        var identKey = vendorId + '-' + modelId;

        // dynamic driver lookup
        if (me.drivers[identKey]) {
            return me.drivers[identKey];
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