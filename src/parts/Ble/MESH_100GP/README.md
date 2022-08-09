# MESH-100GP (MESH GPIO)
MESH-100GP (MESH GPIO) is an app-enabled general-purpose input/output of MESH blocks.

MESH official web site is [here](https://meshprj.com/).

# License
See [LICENSE.txt]().

# Use case

```javascript
// Example
await obniz.ble.initWait();
const MESH_100GP = Obniz.getPartsClass('MESH_100GP');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100GP.isMESHblock(peripheral)) {
        return;
    }
    console.log('found');

    // Create an instance
    const gpioBlock = new MESH_100GP(peripheral);

    // Connect to the GPIO block
    await gpioBlock.connectWait();
    console.log('connected');
    
    // Get sensor data
    const targetPin = MESH_100GP.Pin.P1;
    const digitalInputState = await MESH_100GP.getDigitalInputDataWait(targetPin);
    switch (digitalInputState) {
        case MESH_100GP.DigitalInputState.UP_EDGE:{
            console.log('DigitalInput: UP');
            break;
        }
        case MESH_100GP.DigitalInputState.DOWN_EDGE:{
            console.log('DigitalInput: DOWN');
            break;
        }
        default:
            break;
    }
};
await obniz.ble.scan.startWait();

```

```javascript
// Example
await obniz.ble.initWait();
const MESH_100GP = Obniz.getPartsClass('MESH_100GP');
obniz.ble.scan.onfind = async (peripheral) => {
    if (!MESH_100GP.isMESHblock(peripheral)) {
        return;
    }
    console.log('found');

    // Create an instance
    const gpioBlock = new MESH_100GP(peripheral);

    // Connect to the GPIO block
    await gpioBlock.connectWait();
    console.log('connected');
    
    // Set event handler
    gpioBlock.onDigitalInputEvent = ((pin, state) => {
        const _pin = (pin === MESH_100GP.Pin.P1 ? 'Pin1' : (pin === MESH_100GP.Pin.P2 ? 'Pin2' : 'Pin3'));
        switch (state) {
            case MESH_100GP.State.LOW_2_HIGH:{
                console.log('DigitalInput(' + _pin + '): Low -> High');
                break;
            }
            case MESH_100GP.State.HIGH_2_LOW:{
                console.log('DigitalInput(' + _pin + '): High -> Low');
                break;
            }
            default:
                break;
        }
    });
    gpioBlock.onAnalogInputEvent = ((level) => {
        console.log('Analog Input: ' + level);
    });
    
    // Prepare params (See the linked page below for more information.)
    const digitalInputLow2High = { p1:true, p2:false, p3:true };
    const digitalInputHigh2Low = { p1:true, p2:false, p3:true };
    const analogInputRangeUpper = 30;
    const analogInputRangeBottom = 0;
    const analogInputCondition = MESH_100GP.AnalogInputEventCondition.ABOVE_THRESHOLD;
  
    // Write
    gpioBlock.setModeDigitalInput(digitalInputLow2High, digitalInputHigh2Low);
    gpioBlock.setModeAnalogInput(
        analogInputRangeUpper,
        analogInputRangeBottom,
        analogInputCondition
    );
};
await obniz.ble.scan.startWait();

```

For more information, click [here](https://developer.meshprj.com/).
