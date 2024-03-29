# MESH-100GP (MESH GPIO)
MESH-100GP (MESH GPIO) is an app-enabled general-purpose input/output of MESH blocks.

MESH official web site is [here](https://meshprj.com/).

![](./image.jpg)

# Requirement
MESH block : version 1.2.5 or higher

# Use case

```javascript
// Example
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
    console.log(`connected: ${gpioBlock.peripheral.localName}`);
    
    // Get sensor data
    const targetPin = MESH_100GP.Pin.P1;
    const digitalInputState = await gpioBlock.getDigitalInputDataWait(targetPin);
    switch (digitalInputState) {
        case MESH_100GP.DigitalInputState.HIGH:{
            console.log('DigitalInput: High');
            break;
        }
        case MESH_100GP.DigitalInputState.LOW:{
            console.log('DigitalInput: Low');
            break;
        }
        default:
            break;
    }
};

```

```javascript
// Example
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
    console.log(`connected: ${gpioBlock.peripheral.localName}`);
    
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
    const analogInputRangeLower = 0;
    const analogInputCondition = MESH_100GP.AnalogInputEventCondition.ABOVE_THRESHOLD;
  
    // Write
    gpioBlock.setModeDigitalInput(digitalInputLow2High, digitalInputHigh2Low);
    gpioBlock.setModeAnalogInput(
        analogInputRangeUpper,
        analogInputRangeLower,
        analogInputCondition
    );
};

```

# Related documents
[MESH technical specification](https://developer.meshprj.com/).
