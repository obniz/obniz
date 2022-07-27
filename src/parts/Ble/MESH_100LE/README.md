# MESH-100LE
The MESH-100LE is a product of Sony Marketing Inc.
This is an app-enabled, multi-color, LED indicator for quick prototyping and instant deployment of your project.

# License
See []

## isMESHblock(peripheral)

'''javascript
// Example
await obniz.ble.initWait();
const ledBlock = Obniz.getPartsClass('MESH_100LE');
obniz.ble.scan.onfind = async (peripheral) => {
    if (ledBlock.isMESHblock(peripheral)) {
        console.log('find');
    }
};
await obniz.ble.scan.startWait();

'''

## new M

## [await] connectWait()

## [await] disconnectWait()

## [await] getDataWait()
Get battery level.

## lightup(red, green blue, totalTime, cycleOnTime, cycleOffTime, pattern)