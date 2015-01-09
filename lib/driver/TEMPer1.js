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

    mountedDevices: [],

    /**
     * Automatically mounts any unmounted device supported by
     * this driver implementation.
     * @param {Function} onMounted Event callback
     * @param {Function} onUnmounted Event callback
     */
    autoMount: function(onMounted, onUnmounted) {

        console.log('[ok] Mounting device.');

        // fetch only unmounted devices
        var devices = me.getDevices(true);
    },

    /**
     * Returns an array of TEMPer1 device path's
     * @param {boolean} onlyUnMounted Return only unmounted device path's
     * @return {Array}
     */
    getDevices: function(onlyUnMounted) {

        // TODO
        console.log('TODO: Filter device list by vendorId and productFamily match');

        // get devices
        var devices = USBHID.devices();

        console.log('HID devices', devices);
    }
};

// exports
module.exports = me;