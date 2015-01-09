var USBHID = require('node-hid');

/**
 * @class TEMPer1
 * @namespace driver
 * @singleton
 * TEMPer1 family device driver.
 */
var me = {

    moduleType: 'sensor',

    productFamily: 'TEMPer1',

    vendorId: 3141,

    category: 'temperature',

    mountedDevices: {},

    /**
     * Automatically mounts any unmounted device supported by
     * this driver implementation.
     */
    autoMount: function() {

        console.log('[TEMPer1] Mounting device(s) now.');

        // fetch only unmounted devices
        var devices = me.getSupportedDevices(true);

        console.log('[TEMPer1] UnMounted devices: ', devices);
    },

    /**
     * Automatically un-mounts any mounted device supported by
     * this driver implementation which is not attached anymore.
     */
    autoUnMount: function() {

        console.log('[TEMPer1] UnMounting device(s) now.');
    },

    /**
     * Automatically refreshes any changed device supported by
     * this driver implementation.
     */
    autoRefresh: function () {

        console.log('[TEMPer1] Refreshing device(s) now.');
    },

    /**
     * Returns an array of TEMPer1 device path's
     * @param {boolean} onlyUnMounted Return only unmounted device path's
     * @return {Array}
     */
    getSupportedDevices: function(onlyUnMounted) {

        var allDevices = USBHID.devices();
        var supportedDevices = [];
        var unMountedDevices = [];

        allDevices.forEach(function(device) {

            // filter for devices supported by this driver
            if (String(device.product).indexOf(me.productFamily) > -1 &&
                device.vendorId === me.vendorId &&
                device.interface === 1) {

                supportedDevices.push(
                    device.path
                );
            }
        });

        // filter out devices that are already mounted
        if (onlyUnMounted) {

            supportedDevices.forEach(function(devicePath) {

                if (!me.mountedDevices[devicePath]) {

                    unMountedDevices.push(
                        devicePath
                    );
                }
            });

            return unMountedDevices;

        } else {

            return supportedDevices;
        }
    }
};

// exports
module.exports = me;