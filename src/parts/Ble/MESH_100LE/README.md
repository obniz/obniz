# MESH-100LE (MESH LED)
MESH-100LE (MESH LED) is an app-enabled LED indicator of MESH blocks.

MESH official web site is [here](https://meshprj.com/).

# License
See [LICENSE.txt]().

# Use case

```javascript
// Example
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
    
    // Prepare params (See the linked page below for more information.)
    const colors = {
        red: 15,    // Set LED-Red in the range of 0 to 127.
        green: 63,  // Set LED-Green in the range of 0 to 127.
        blue: 0     // Set LED-Blue in the range of 0 to 127.
    };
    const totalTime = 4000;     // Set the total control time in the range of 0 to 65,535[ms].
    const cycleOnTime = 1000;   // Set the light on time in cycle in the range of 0 to 65,535[ms].
    const cycleOffTime = 500;   // Set the light off time in cycle in the range of 0 to 65,535[ms].
    const pattern = MESH_100LE.Pattern.FIREFLY; // Set the blinking pattern to blink or firefly.

    // Write
    ledBlock.setLed(colors, totalTime, cycleOnTime, cycleOffTime, pattern);
};

```

For more information, click [here](https://developer.meshprj.com/).
