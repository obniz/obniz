# DR MARK

This is an intravenous drip monitoring tool manufactured by Mark Electronics, Inc.

It can measure, monitor, and record the flow rate for spontaneous drug infusions.

It can notify the user of abnormal flow rates or the completion of an infusion.

![](./image.jpg)

## isDevice(peripheral)

Determines if it is a DR MARK or not based on the advertisement information received by the BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
  
  }
};
await obniz.ble.scan.startWait();

```

## new DR_MARK(peripheral)

Instances are created based on the advertisement information received by the BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
  }
};
await obniz.ble.scan.startWait();

```

## [await]connectWait()

Connect to the device.


```javascript
// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    }
    await device.connectWait();
    console.log("connected");
  }
};
await obniz.ble.scan.startWait();


```

## [await]disconnectWait()

Disconnect from sensor.

```javascript
// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();


```

## [await]getActionModeWait()

Obtains the operation mode.

- stop
- adjust
- monitor
- suspend
- finish

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const mode = await device.getActionModeWait();
    console.log(mode);
  }
};
await obniz.ble.scan.startWait();

```

## [await]setActionModeWait()

Sets the operation mode.

- stop
- adjust
- start
- monitor
- pause

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const humid = await device.setActionModeWait("start");
    console.log(humid);
  }
};
await obniz.ble.scan.startWait();

```

## [await]setConditionSettingWait(infusionDropCount: number, targetSumFlowRate: number, targetFlowRate: number, correctionFactor: number)

Set the measurement conditions.

- infusionDropCount default 20drops
- targetSumFlowRate  (ml) default 500ml
- targetFlowRate (ml/h) default 250ml/h
- correctionFactor (-20% ～ 20%) default 0%

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.setConditionSettingWait(20,500,250,0);
  }
};
await obniz.ble.scan.startWait();

```

## [await]getConditionSettingWait()

Get the measurement condition.

The data is equivalent to `getConditionSettingWait`.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const conditionSettingData = await device.getConditionSettingWait();
    console.log(conditionSettingData);
  }
};
await obniz.ble.scan.startWait();

```

## [await]setBaseSettingWait(effectiveInstantFlowRate: number, finishJudgmentSec: number, effectiveIntegratedFlowRate: number, powerOffSec: number)

Basic settings.

- effectiveInstantFlowRate Effective instantaneous flowrate (%) Used for instantaneous flowrate determination Difference of instantaneous flowrate to target flowrate default 30%
- finishJudgmentSec Infusion end judgment time (after seconds) Infusion end judgment (sensor signal no-response time) default 60s
- effectiveIntegratedFlowRate Effective totalized flowrate (%) Judges the total totalized flowrate *Calculates the invalid interval for judging flowrate abnormality during measurement default 10%
- powerOffSec Auto power off time (after seconds) default 60s

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.setBaseSettingWait(30,60,10,60);
  }
};
await obniz.ble.scan.startWait();

```

## [await]getBaseSettingWait()

Get the base setting.

The data is equivalent to `getBaseSettingWait`.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const baseSettingData = await device.getBaseSettingWait();
    console.log(baseSettingData);
  }
};
await obniz.ble.scan.startWait();

```

## [await]setLedSettingWait(bright: boolean)

LED brightness setting.

When true, the brightness will be set to bright.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.setLedSettingWait(true);
  }
};
await obniz.ble.scan.startWait();

```

## データの取得方法について

During the measurement run, there are periodic BLE advertisements.

The information that can be retrieved is the same, but there are multiple ways to read it.

- Get only one
- Get multiple cases
- Callback

The information that can be retrieved is as follows

```typescript
{
  sequenceNumber: number; // sequence number (1~0xFFFFFFFFFF)
  pulse: number; // period data in units of 0.1ms (24bits)
  status: number; // status data during measurement (8bits)
  error: {
    outRange: boolean; // pulse period before moving average is less than 288ms
    changeSetting: boolean; // measurement condition setting value was changed in interrupt mode
    overSumFlow: boolean; // the totalized flow exceeds the set amount
    lowInstantFlow: boolean; // flow rate is lower than the specified value
    highInstantFlow: boolean; // flow rate is higher than the specified value
    shutdownBattery: boolean; // battery level is below power down level
    lowBattery: boolean; // battery level is low
    isError: boolean; // whether an error has occurred
  }
  instantFlowRate: number; // instantaneous flow rate (ml / h)
  sumFlowRate: number; // totalized flow rate (ml)
  averageFlowRate: number; // average flow rate (ml / h)
  batteryVoltage: number; // voltage value (mV)
}
```

## [await]getPulseDataWait(timeoutMs?: number)

Only one case is retrieved.

If no timeout is set, timeout will occur in 5 seconds.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const pulseData = await device.getPulseDataWait();
    console.log(pulseData)
  }
};
await obniz.ble.scan.startWait();

```

## [await]startPulseDataWait()

Starts acquiring multiple cases.

Continue acquiring until ``stopPulseDataWait`` is executed.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.startPulseDataWait();
    await obniz.wait(10000);
    const pulseDatas = await device.stopPulseDataWait();
    console.log(pulseDatas)
    
  }
};
await obniz.ble.scan.startWait();

```

## [await]stopPulseDataWait()

Terminates the acquisition of multiple cases.

Returns an array of pulse data from ``startPulseDataWait`` to this function.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.startPulseDataWait();
    await obniz.wait(10000);
    const pulseDatas = await device.stopPulseDataWait();
    console.log(pulseDatas)
    
  }
};
await obniz.ble.scan.startWait();

```

## [await]requestPulseDataWait(enable: boolean)

Sets whether Pulse data will be delivered periodically.

If set to "true", the data will be delivered periodically.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    device.onpulse = (pulseData) => {
      console.log(pulseData);
    };
    await device.connectWait();
    console.log("connected");
    await device.requestPulseDataWait(true);
    await obniz.wait(10000);
    await device.requestPulseDataWait(false);
  }
};
await obniz.ble.scan.startWait();

```


## [await]eraseFlashRomWait()

erase FlashROM

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const mode = await device.eraseFlashRomWait()
  }
};
await obniz.ble.scan.startWait();
```

## [await]getFlashRomInfoWait(timeOffsetMinute:時差を入れる)

The number of data stored in FlashROM can be checked.
Check the date and time of the latest and oldest measurements.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const info = await device.getFlashRomInfoWait(0)
    console.log(info)
  }
};
await obniz.ble.scan.startWait();
```

## [await]getFlashRomSearchWait(startDate:検索開始日,endDate:検索終了日,timeOffsetMinute:時差を入れる)

The number of data stored in FlashROM can be checked.
Able to check the Index and the number of pieces in the measurement history at a specified time

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const info = await device.getFlashRomInfoWait(0)
    console.log(info)
    if(info.total != 0){
      const result = await device.getFlashRomSearchWait(info.endDate,info.endDate,0)
      console.log(result)
    }
  }
};
await obniz.ble.scan.startWait();
```


## [await]getFlashRomHistoryDataWait(index: number,timeOffsetMinute: number)

Obtains the measurement history stored in FlashROM.
If you request index as 0xFFFF when you are in exit mode, you will get the latest results.
Otherwise, you can retrieve it based on the index retrieved by ``getFlashRomSearchWait``.

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const mode = await device.getActionModeWait()
    if(mode === "finish"){
      const history = await device.getFlashRomSearchWait(0xffff,0);
      console.log(history)
    }
  }
};
await obniz.ble.scan.startWait();
```
