# MESH-100LE
The MESH-100LE is a product of Sony Marketing Inc.
This is an app-enabled, multi-color, LED indicator for quick prototyping and instant deployment of your project.

# License
See [LICENSE.txt]().

## isMESHblock(peripheral)

Check whether it is a MESH LED block based on the advertised information received by the BLE.

```javascript
// Example
await obniz.ble.initWait();
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
obniz.ble.scan.onfind = async (peripheral) => {
    if (MESH_100LE.isMESHblock(peripheral)) {
        console.log('find');
    }
};
await obniz.ble.scan.startWait();

```

## sameSirialNumberBlock(peripheral)

Check whether it is a MESH LED block that has same serial number based on the advertised information received by the BLE.

```javascript
// Example
await obniz.ble.initWait();
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
obniz.ble.scan.onfind = async (peripheral) => {
    if (MESH_100LE.sameSirialNumberBlock(peripheral, '1234567')) {
        console.log('find');
    }
};
await obniz.ble.scan.startWait();

```

## new MESH_100LE(peripheral)

Create an instance based on the advertisement information.

```javascript
// Example
await obniz.ble.initWait();
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100LE.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');
    const ledBlock = new MESH_100LE(peripheral);
};
await obniz.ble.scan.startWait();

```

## [await] connectWait()

connect to LED block.

```javascript
// Example
await obniz.ble.initWait();
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100LE.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');
    const ledBlock = new MESH_100LE(peripheral);
    await ledBlock.connectWait();
    console.log('connected');
};
await obniz.ble.scan.startWait();

```

## [await] disconnectWait()

MESHの場合いらない？GPIOはVCCをOFFにしてあげた方が良い？

## [await] getDataWait()

Get LED block's information.

```javascript
// Example
await obniz.ble.initWait();
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100LE.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');
    const ledBlock = new MESH_100LE(peripheral);
    await ledBlock.connectWait();
    console.log('connected');
    const data = await ledBlock.getDataWait();
    console.log(data);
};
await obniz.ble.scan.startWait();

```

Output example is this.

```
{
    name: 'MESH-100LE1234567', // Get LED block's device name.
    address: 'XY1234567890', // Get LED block's bluetooth address.
    battery: 10 // Get LED block's battery level. The remaining battery level is from 0 to 10.
}

```

## lightup(red, green blue, totalTime, cycleOnTime, cycleOffTime, pattern)

```javascript
// Example
await obniz.ble.initWait();
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100LE.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');
    const ledBlock = new MESH_100LE(peripheral);
    await ledBlock.connectWait();
    console.log('connected');
    const red = 63; // Set LED-red from 0 to 127
    const green = 127; // Set LED-green from 0 to 127
    const blue = 31; // Set LED-blue from 0 to 127
    const totalTime = 4000; // Set total control time form 0 to 65,535[ms]. More detail is below. /ex 4.000[s]
    const cycleOnTime = 1000; // Set On-interval from 0 to 65,535[ms]. More detail is below. /ex 1.000[s]
    const cycleOffTime = 500; // Set Off-interval from 0 to 65,535[ms]. More detail is below. /ex 0.500[s]
    const pattern = MESH_100LE.Pattern.SOFT; // Set LED pattern blink or firefly.
    ledBlock.lightup(red, green, blue, totalTime, cycleOnTime, cycleOffTime, pattern);
};
await obniz.ble.scan.startWait();

```

More detail is [here]().
