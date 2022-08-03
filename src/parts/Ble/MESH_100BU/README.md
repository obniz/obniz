# MESH-100BU
Official product introduction page is [here](https://shop.meshprj.com/products/button)

Functions: Press, Hold, Double Press
Rechargeable: build-in Li battery, 100mAh, approx 30-day battery life
Compact: approx W24 * H48 * D12 mm

# License
See [LICENSE.txt]().

## Use case

```javascript
// Example
await obniz.ble.initWait();
const MESH_100BU = Obniz.getPartsClass('MESH_100BU');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100BU.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');

    // Create an instance
    const buttonBlock = new MESH_100BU(peripheral);

    // Connect to LED block
    await buttonBlock.connectWait();
    console.log('connected');
    
    let count = 0;
    const GOAL = 10;
    
    // Single Pressed Event
    buttonBlock.onSinglePressed = (() => {
        ++ count;
        console.log('Single pressed, Plus 1; count = ' + count);
        if (count === GOAL) { console.log('YOU ARE WON !!');}
    });
    
    // Double Pressed Event
    buttonBlock.onDoublePressed = (() => {
        count += 2;
        console.log('Double pressed, Plus 2; count = ' + count);
        if (count === GOAL) { console.log('YOU ARE WON !!');}
    });
    
    // Long Pressed Event
    buttonBlock.onLongPressed = (() => {
        count = 0;
        console.log('Long pressed, Reset count; count = ' + count);
    });
};
await obniz.ble.scan.startWait();

```

More detail is [here]().