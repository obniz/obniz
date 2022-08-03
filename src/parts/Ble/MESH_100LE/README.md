# MESH-100LE
Official product introduction page is [here](https://shop.meshprj.com/products/led)

Functions: color and pattern control (light up, firefly, blink, off)
Customizable settings: brightness, duration, cycle, interval
Rechargeable: build-in Li battery, 100mAh, approx 30-day battery life
Compact: approx W24 * H48 * D12 mm

# License
See [LICENSE.txt]().

## Use case

```javascript
// Example
await obniz.ble.initWait();
const MESH_100LE = Obniz.getPartsClass('MESH_100LE');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100LE.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');

    // Create an instance
    const ledBlock = new MESH_100LE(peripheral);

    // Connect to LED block
    await ledBlock.connectWait();
    console.log('connected');
    
    // Prepare params
    const colors = {
        red: 15, // Set LED-Red from 0 to 127
        green: 63, // Set LED-Green from 0 to 127
        blue: 0 // Set LED-Blue from 0 to 127
    };
    const totalTime = 4000; // Set total control time form 0 to 65,535[ms]. More detail is below. /ex 4.000[s]
    const cycleOnTime = 1000; // Set On-interval from 0 to 65,535[ms]. More detail is below. /ex 1.000[s]
    const cycleOffTime = 500; // Set Off-interval from 0 to 65,535[ms]. More detail is below. /ex 0.500[s]
    const pattern = MESH_100LE.Pattern.FIREFLY; // Set LED pattern blink or firefly.

    // Write
    ledBlock.setLed(colors, totalTime, cycleOnTime, cycleOffTime, pattern);
};
await obniz.ble.scan.startWait();

```

More detail is [here]().
