# MESH-100AC (MESH Move) 
MESH-100AC (MESH Move) is an app-enabled accelerometer of MESH blocks.  
MESH official web site is [here](https://meshprj.com/).

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
    console.log('found');

    // Create an instance
    const moveBlock = new MESH_100AC(peripheral);

    // Connect to the Move block
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
