/**
 * @class TEMPer1
 * @namespace driver
 * @singleton
 * TEMPer1 family device driver.
 */
var me = {

    /**
     * Mounts the device given
     * @param {Object} deviceDescriptor USB device description
     * @param {Function} onMounted Event callback
     * @param {Function} onUnmounted Event callback
     */
    mount: function(deviceDescriptor, onMounted, onUnmounted) {

        console.log('Trying to mounting: ', deviceDescriptor);
    }
};

// exports
module.exports = me;