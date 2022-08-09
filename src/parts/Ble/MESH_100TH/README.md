# MESH-100TH (MESH Temperature & Humidity)
MESH-100TH (MESH Temperature & Humidity) is an app-enabled temperature and humidity sensor of MESH blocks.

MESH official web site is [here](https://meshprj.com/).

# License
See [LICENSE.txt]().

# Use case

```javascript
// Example
await obniz.ble.initWait();
const MESH_100TH = Obniz.getPartsClass('MESH_100TH');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100TH.isMESHblock(peripheral)) {
        return;
    }
    console.log('found');

    // Create an instance
    const temphumidBlock = new MESH_100TH(peripheral);

    // Connect to the Temperature & Humidity block
    await temphumidBlock.connectWait();
    console.log('connected');
    
    // Get sensor data
    const res = await temphumidBlock.getSensorDataWait();
    console.log('temperature: ' + res.temperature + ', humidity: ' + res.humidity);
};
await obniz.ble.scan.startWait();

```

```javascript
// Example
await obniz.ble.initWait();
const MESH_100TH = Obniz.getPartsClass('MESH_100TH');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100TH.isMESHblock(peripheral)) {
        return;
    }
    console.log('found');

    // Create an instance
    const temphumidBlock = new MESH_100TH(peripheral);

    // Connect to the Temperature & Humidity block
    await temphumidBlock.connectWait();
    console.log('connected');
    
    // Set event handler
    temphumidBlock.onSensorEvent = ((temperature, humidity) => {
        console.log('temperature: ' + temperature + ', humidity: ' + humidity);
    });

    // Prepare params (See the linked page below for more information.)
    const notifyMode = MESH_100TH.NotifyMode.ALWAYS;
    const tempUpper = 50;
    const tempBottom = -10;
    const humidUpper = 100;
    const humidBottom = 0;
    const tempCondition = MESH_100TH.EmitCondition.ABOVE_UPPER_AND_ABOVE_BOTTOM;
    const humidCondition = MESH_100TH.EmitCondition.ABOVE_UPPER_AND_ABOVE_BOTTOM;
    
    // Write
    temphumidBlock.setMode(
        tempUpper,
        tempBottom,
        humidUpper,
        humidBottom,
        tempCondition,
        humidCondition,
        notifyMode
    );
};
await obniz.ble.scan.startWait();

```

For more information, click [here](https://developer.meshprj.com/).
