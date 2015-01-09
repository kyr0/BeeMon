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

    driverManager: null,

    /**
     * Initializes the device driver
     * @param {DriverManager} driverManager Manager instance
     */
    init: function (driverManager) {

        // back-reference
        me.driverManager = driverManager;
    },

    /**
     * Automatically mounts any unmounted device supported by
     * this driver implementation.
     */
    autoMount: function() {

        console.log('[TEMPer1] Mounting device(s) now.');

        var devicePaths = me.getSupportedDevices(/*onlyUnMounted*/ true);

        // walk device paths and assign
        for (var i=0; i<devicePaths.length; i++) {
            me.mountDevice(devicePaths[i]);
        }
    },

    /**
     * Mounts the device
     * @param {String} devicePath USB HID device path
     */
    mountDevice: function(devicePath) {

        var device = new USBHID.HID(devicePath),
            sensorInterface = me.createSensorInterface(device);

        // mark as mounted and assign instance in same map
        me.mountedDevices[devicePath] = sensorInterface;

        // add's a sensor
        me.driverManager.addSensor(sensorInterface);

        console.log('[TEMPer1] Device mounted successfully.');
        console.log('[TEMPer1] SensorInterface: ', sensorInterface);
    },

    /**
     * Creates a high-level sensor API object
     * @param {HID} device HID object
     * @return {Object}
     */
    createSensorInterface: function(device) {

        return {
            device: device,
            category: me.category,
            productFamily: me.productFamily,
            read: function(cb) {

                // READ command
                device.write([
                    0x01,
                    0x80,
                    0x33,
                    0x01,
                    0x00,
                    0x00,
                    0x00,
                    0x00
                ]);

                // register READ callback
                device.read(function(error, binary){

                    // no valid data, omitting
                    if (error) {
                        return;
                    }

                    var highByte = binary[2],
                        lowByte = binary[3],
                        sign = highByte & (1 << 7),
                        temp = ((highByte & 0x7F) << 8) | lowByte;

                    if (sign) {
                        temp = -temp;
                    }
                    temp = temp * 125.0 / 32000.0;

                    // propagate temperature in degree/celsius
                    cb(temp);
                });
            }
        };
    },

    /**
     * Automatically un-mounts any mounted device supported by
     * this driver implementation which is not attached anymore.
     */
    autoUnMount: function() {

        console.log('[TEMPer1] UnMounting device(s) now.');

        // TODO
    },

    /**
     * Automatically refreshes any changed device supported by
     * this driver implementation.
     */
    autoRefresh: function () {

        console.log('[TEMPer1] Refreshing device(s) now.');

        // TODO
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