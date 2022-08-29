# MESH-100BU (MESH Button)
MESH-100BU (MESH Button) is an app-enabled push button of MESH blocks.

MESH official web site is [here](https://meshprj.com/).

# License
See [LICENSE.txt]().

# Use case

```javascript
// Example
const MESH_100BU = Obniz.getPartsClass('MESH_100BU');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100BU.isMESHblock(peripheral)) {
        return;
    }
    console.log('found');

    // Create an instance
    const buttonBlock = new MESH_100BU(peripheral);

    // Connect to the Button block
    await buttonBlock.connectWait();
    console.log('connected');
    
    let count = 0;
    const GOAL = 10;
    
    // Single Pressed Event
    buttonBlock.onSinglePressed = (() => {
        ++ count;
        console.log('Single pressed, 1 count added; count = ' + count);
        if (count === GOAL) { console.log('YOU WIN !!');}
    });
    
    // Double Pressed Event
    buttonBlock.onDoublePressed = (() => {
        count += 2;
        console.log('Double pressed, 2 counts added; count = ' + count);
        if (count === GOAL) { console.log('YOU WIN !!');}
    });
    
    // Long Pressed Event
    buttonBlock.onLongPressed = (() => {
        count = 0;
        console.log('Long pressed, count has been reset; count = ' + count);
    });
};

```

For more information, click [here](https://developer.meshprj.com/).
