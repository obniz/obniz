# MESH-100MD
Official product introduction page is [here](https://shop.meshprj.com/products/motion)

Infrared motion sensor  
Rechargeable: build-in Li battery, 100mAh, approx 30-day battery life  
Compact: approx W24 * H48 * D12 mm

# License
See [LICENSE.txt]().

## Use case

```javascript
// Example
await obniz.ble.initWait();
const MESH_100MD = Obniz.getPartsClass('MESH_100MD');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100MD.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');

    // Create an instance
    const motionBlock = new MESH_100MD(peripheral);

    // Connect to LED block
    await motionBlock.connectWait();
    console.log('connected');
    
    // Get sensor data
    const motionState = await motionBlock.getSensorDataWait();
    switch (motionState) {
        case mesh_md.MotionState.DETECTED: {
            console.log('Detected !');
            break;
        }
        case mesh_md.MotionState.NOT_DETECTED: {
            console.log('Not Detected.');
            break;
        }
        default: {
            console.log('During Startup...');
            break;
        }
    }
};
await obniz.ble.scan.startWait();

```

```javascript
// Example
await obniz.ble.initWait();
const MESH_100MD = Obniz.getPartsClass('MESH_100MD');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100MD.isMESHblock(peripheral)) {
        return;
    }
    console.log('find');

    // Create an instance
    const motionBlock = new MESH_100MD(peripheral);

    // Connect to LED block
    await motionBlock.connectWait();
    console.log('connected');
    
    // Set event handler
    motionBlock.onSensorEvent = ((motionState, notifyMode) => {
        switch (motionState) {
            case mesh_md.MotionState.DETECTED: {
                console.log('Detected !');
                break;
            }
            case mesh_md.MotionState.NOT_DETECTED: {
                console.log('Not Detected.');
                break;
            }
            default: {
                console.log('During Startup...');
                break;
            }
        }
    });

    // Prepare params
    const notifyMode = mesh_md.NotifyMode.ALWAYS;
    
    // Write
    motionBlock.setMode(notifyMode);
};
await obniz.ble.scan.startWait();

```

More detail is [here]().
