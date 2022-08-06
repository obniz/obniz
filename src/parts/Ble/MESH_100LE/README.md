# MESH-100LE (MESH LED)
MESH-100LE (MESH LED) is an app-enabled LED indicator of MESH blocks.  
MESH official web site is [here](https://meshprj.com/).

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
    console.log('found');

    // Create an instance
    const ledBlock = new MESH_100LE(peripheral);

    // Connect to the LED block
    await ledBlock.connectWait();
    console.log('connected');
    
    // Prepare params
    const colors = {
        red: 15, // Set LED-Red from 0 to 127
        green: 63, // Set LED-Green from 0 to 127
        blue: 0 // Set LED-Blue from 0 to 127
    };
    const totalTime = 4000; // Set total control time form 0 to 65,535[ms]. click the link below for more details. /ex 4.000[s]
    const cycleOnTime = 1000; // Set On-interval from 0 to 65,535[ms]. click the link below for more details. /ex 1.000[s]
    const cycleOffTime = 500; // Set Off-interval from 0 to 65,535[ms]. click the link below for more details. /ex 0.500[s]
    const pattern = MESH_100LE.Pattern.FIREFLY; // Set LED pattern blink or firefly.

    // Write
    ledBlock.setLed(colors, totalTime, cycleOnTime, cycleOffTime, pattern);
};
await obniz.ble.scan.startWait();

```

More detail is [here]().
