# MESH-100MD (MESH Motion)
MESH-100MD (MESH Motion) is an app-enabled infrared motion sensor of MESH blocks.

MESH official web site is [here](https://meshprj.com/).

# License
See [LICENSE.txt]().

# Use case

```javascript
// Example
await obniz.ble.initWait();
const MESH_100MD = Obniz.getPartsClass('MESH_100MD');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100MD.isMESHblock(peripheral)) {
        return;
    }
    console.log('found');

    // Create an instance
    const motionBlock = new MESH_100MD(peripheral);

    // Connect to the Motion block
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
            console.log('Starting up...');
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
    console.log('found');

    // Create an instance
    const motionBlock = new MESH_100MD(peripheral);

    // Connect to the Motion block
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
                console.log('Starting up...');
                break;
            }
        }
    });

    // Prepare params
    const notifyMode = MESH_100MD.NotifyMode.ALWAYS;
    
    // Write
    motionBlock.setMode(notifyMode);
};
await obniz.ble.scan.startWait();

```

For more information, click [here](https://developer.meshprj.com/).
