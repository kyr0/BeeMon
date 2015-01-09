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
     * @param {Object} deviceDescriptor UDEV USB device description
     */
    onDeviceAttached: function(deviceDescriptor) {

        me.onDriverAvailable(deviceDescriptor, function(deviceDriver) {

            console.log('[USB] Attached [' + deviceDriver.moduleType + '] [' + deviceDriver.category + '] ' +
                        'device driver found:', deviceDriver.productFamily);

            // trigger auto mount
            deviceDriver.autoMount();
        });
    },

    /**
     * Gets called when a device gets detached to the USB host controller
     * @param {Object} deviceDescriptor UDEV USB device description
     */
    onDeviceDetached: function(deviceDescriptor) {

        me.onDriverAvailable(deviceDescriptor, function(deviceDriver) {

            console.log('[USB] Detached [' + deviceDriver.moduleType + '] [' + deviceDriver.category + ']: ' +
                        deviceDriver.productFamily);

            // trigger auto un-mount
            deviceDriver.autoUnMount();
        });
    },

    /**
     * Gets called when a device gets changed on the USB host controller
     * @param {Object} deviceDescriptor UDEV USB device description
     */
    onDeviceChanged: function(deviceDescriptor) {

        me.onDriverAvailable(deviceDescriptor, function(deviceDriver) {

            console.log('[USB] Changed [' + deviceDriver.moduleType + '] [' + deviceDriver.category + ']: ' +
                        deviceDriver.productFamily);

            // trigger auto refresh
            deviceDriver.autoRefresh();
        });
    },

    /**
     * Looks up for any driver available for the device's model/vendor.
     * Calls the callback function if a device driver has been found.
     * @param {Object} deviceDescriptor UDEV USB device description
     * @param {Function} callback Callback
     */
    onDriverAvailable: function (deviceDescriptor, callback) {

        // lookup driver
        var deviceDriver = me.lookupDriver(
            deviceDescriptor.ID_MODEL,
            deviceDescriptor.ID_VENDOR_ID
        );

        // device driver found
        if (deviceDriver) {

            // call callback
            callback(deviceDriver);
        }
    },

    /**
     * Filters the drivers map for a suitable driver.
     * Returns
     * @param model
     * @param vendorId
     */
    lookupDriver: function (model, vendorId) {

        // cast to string
        model = String(model);

        // cast from hex to dec
        vendorId = parseInt(vendorId, 16);

        // dynamic driver lookup
        for (var family in me.drivers) {

            if (me.drivers.hasOwnProperty(family)) {

                if (model.indexOf(family) > -1 &&
                    me.drivers[family]['vendorId'] === vendorId) {

                    return me.drivers[family];
                }
            }
        }
        return false;
    }
};

// export
module.exports = me;