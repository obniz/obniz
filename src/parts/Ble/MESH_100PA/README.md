# MESH-100PA (MESH Brightness)
MESH-100PA (MESH Brightness) is an app-enabled light sensor of MESH blocks.

MESH official web site is [here](https://meshprj.com/).

# License
See [LICENSE.txt]().

# Use case

```javascript
// Example
const MESH_100PA = Obniz.getPartsClass('MESH_100PA');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100PA.isMESHblock(peripheral)) {
        return;
    }
    console.log('found');

    // Create an instance
    const brightnessBlock = new MESH_100PA(peripheral);

    // Connect to the Brightness block
    await brightnessBlock.connectWait();
    console.log('connected');
    
    // Get sensor data
    const res = await brightnessBlock.getSensorDataWait();
    console.log('proximity: ' + res.proximity + ', brightness: ' + res.brightness);
};

```

```javascript
// Example
const MESH_100PA = Obniz.getPartsClass('MESH_100PA');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100PA.isMESHblock(peripheral)) {
        return;
    }
    console.log('found');

    // Create an instance
    const brightnessBlock = new MESH_100PA(peripheral);

    // Connect to the Brightness block
    await brightnessBlock.connectWait();
    console.log('connected');
    
    // Set event handler
    brightnessBlock.onSensorEvent = ((proximity, brightness) => {
        console.log('proximity: ' + proximity + ', brightness: ' + brightness);
    });

    // Prepare params (See the linked page below for more information.)
    const notifyMode = MESH_100PA.NotifyMode.ALWAYS;
    
    // Write
    brightnessBlock.setMode(notifyMode);
};

```

For more information, click [here](https://developer.meshprj.com/).
