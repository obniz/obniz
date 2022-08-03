# MESH-100AC
Official product introduction page is [here](https://shop.meshprj.com/products/move)

Functions: detects shaking, flipping, vibration, and orientation (Front, back, left, right, top, bottom)
Rechargeable: build-in Li battery, 100mAh, approx 30-day battery life
Compact: approx W24 * H48 * D12 mm

# License
See [LICENSE.txt]().

## Use case

```javascript
// Example
await obniz.ble.initWait();
const MESH_100AC = Obniz.getPartsClass('MESH_100AC');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100AC.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');

    // Create an instance
    const moveBlock = new MESH_100AC(peripheral);

    // Connect to LED block
    await moveBlock.connectWait();
    console.log('connected');
    
    // Tap Event
    moveBlock.onTapped = ((accele) => {
        console.log('tapped! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
    });

    // Shake Event
    moveBlock.onShaked = ((accele) => {
        console.log('shaked! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
    });

    // Flip Event
    moveBlock.onFlipped = ((accele) => {
        console.log('flipped! (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
    });
    
    // Orientation Event
    moveBlock.onOrientation = ((face, accele) => {
        console.log('orientation ' + face + ', (ax, ay, az) = (' + accele.x + ', ' + accele.y + ',' + accele.z + ')');
    });
};
await obniz.ble.scan.startWait();

```

More detail is [here]().
