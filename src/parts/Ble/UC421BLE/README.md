# UC421BLE
This is a body composition analyzer from A&D Corporation.

![](./image.jpg)

## isDevice(peripheral)

Judges whether or not it is UC421BLE based on the advertised information received by the BLE.
```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```


## getManufacturerSpecificDataFromAdv(peripheral)

Extract a manufacturer specific data from an advertisement sent from UC421BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral)) {
      console.log("device find");
      const msData = UC421BLE.getManufacturerSpecificDataFromAdv(peripheral);
      if (msData.opMode.runningMode === 'measurementWithApp') {
        // do something
      } else {
        // do something
      }
  }
};
await obniz.ble.scan.startWait();

```


## new UC421BLE(peripheral)

Instances are created based on the advertised information received by the BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
  }
};
await obniz.ble.scan.startWait();

```

## [await]aquireNewUserNoWait(cc)

Aquire a new user No.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    const cc = 1234;
    const userNo = await uc421Ble.aquireNewUserNoWait(cc);
    console.log(userNo); // userNo is 1, for example
  }
};
await obniz.ble.scan.startWait();

```


## [await]authorizeUserWait(userNo, cc)

Authorize a user.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    const userNo = 1;
    const cc = 1234;
    await uc421Ble.authorizeUserWait(userNo, cc);
  }
};
await obniz.ble.scan.startWait();

```
## [await]updateUserInfoDataWait(userInfo)

Update a user info. After aquiring a new user No, it's recommended to register an initial user info attached to it.
To use this function, you first need to authorize a user by calling authorizeUserWait function.
After that, you can update a personal info of the user.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    const userNo = 1;
    const cc = 1234;
    await uc421Ble.authorizeUserWait(userNo, cc);
    const userInfo: UC421BLE.UC421BLEUserInfoData = {
        email: 'email@email.com',
        firstName: 'first name',
        lastName: 'last name',
        birth: {
        year: 2000,
        month: 1,
        day: 30,
        },
        height: 172,
        gender: 'male',
    };
    await uc421Ble.updateUserInfoDataWait(userInfo); // update user info for userNo 1
  }
};
await obniz.ble.scan.startWait();

```


## [await]getUserInfoDataWait()

Get a user info. To use this function, you first need to authorize a user by calling authorizeUserWait function.
Then you can get a personal info of the user.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    const userNo = 1;
    const cc = 1234;
    await uc421Ble.authorizeUserWait(userNo, cc);
    const userInfo = await uc421Ble.getUserInfoDataWait();
    console.log(userInfo); // user info for userNo 1
  }
};
await obniz.ble.scan.startWait();

```


## [await]getWeightDataWait()

Get a list of measured weight data. To use this function, you first need to authorize a user by calling authorizeUserWait function.
After that, you can get the data attached to the user. If the multiple weight data are stored in memory, multiple data will be returned.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    const userNo = 1;
    const cc = 1234;
    await uc421Ble.authorizeUserWait(userNo, cc);
    const weightData = await uc421Ble.getWeightDataWait();
    console.log(weightData); // weight data for userNo 1
    await uc421Ble.disconnectWait(); // after getting the data, you should call this
  }
};
await obniz.ble.scan.startWait();

```

## [await]getBodyCompositionDataWait()

Get a list of measured body composition data. To use this function, you first need to authorize a user by calling authorizeUserWait function.
After that, you can get the data attached to the user. If the multiple body composition data are stored in memory, multiple data will be returned.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    const userNo = 1;
    const cc = 1234;
    await uc421Ble.authorizeUserWait(userNo, cc);
    const bodyCompositionData = await uc421Ble.getBodyCompositionDataWait();
    console.log(bodyCompositionData); // body composition data for userNo 1
    await uc421Ble.disconnectWait(); // after getting the data, you should call this
  }
};
await obniz.ble.scan.startWait();

```

Or if you want to get both weight and body composision data, the code will be something like this:

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    const userNo = 1;
    const cc = 1234;
    await uc421Ble.authorizeUserWait(userNo, cc);

    // Just write these sequentially.
    const weightData = await uc421Ble.getWeightDataWait();
    console.log(weightData); // weight data for userNo 1
    const bodyCompositionData = await uc421Ble.getBodyCompositionDataWait();
    console.log(bodyCompositionData); // body composition data for userNo 1

    await uc421Ble.disconnectWait(); // Don't forget to call this.
  }
};
await obniz.ble.scan.startWait();

```

## [await]changeRunningModeWait(mode)

Change the runnning mode. By default it's 'measurement' mode, and if you want to do some setting, call this function with an argument 'setting' and go into 'setting' mode.
After 180 seconds passed since this function called, it gets back to its normal 'measurement' mode from 'setting' mode.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    // go into setting mode
    await uc421Ble.changeRunningModeWait('setting');
    console.log('went into setting mode');
  }
};
await obniz.ble.scan.startWait();

```


## [await]setMedicalExamModeWait(mode)

Set medical exam mode. To use this function, you first need to have the peripheral go into 'setting' mode by calling changeRunningModeWait function.
Medical exam mode does not require normal users(No: 1 ~ 5 and cc: 0 ~ 9999), it only uses a guest user(No: 99 and cc: 9999) and no data is saved in memory.
This mode supports two situations. 'measurementWithApp' and 'measurementWithoutApp' both indicated in an advertisement.
Currently, obniz.js only supports the 'measurementWithoutApp' situation, so you can only get the weight data with this mode.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.pairingWait();
    // go into setting mode
    await uc421Ble.changeRunningModeWait('setting');
    console.log('went into setting mode');
    // set medical exam mode on
    await uc421Ble.setMedicalExamModeWait('on');
    console.log('went into medical exam mode');

    const isOn = await uc421Ble.isMedicalExamModeOnWait();
    console.log('medical exam mode is', isOn);
  }
};
await obniz.ble.scan.startWait();

```

If you want to get weight data with a medical exam mode, the code will be something like this.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UC421BLE = Obniz.getPartsClass("UC421BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UC421BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UC421BLE(peripheral);
    await uc421Ble.connectWait(); // medical exam mode does not need pairing. just connecting will be fine.
    const isOn = await uc421Ble.isMedicalExamModeOnWait();
    console.log('medical exam mode is', isOn); // This should be on.
    const userNo = 99;
    const cc = 9999;
    await uc421Ble.authorizeUserWait(userNo, cc);
    const weightData = await uc421Ble.getWeightDataWait();
    console.log(weightData); // weight data for userNo 1
    await uc421Ble.disconnectWait(); // after getting the data, you should call this
  }
};
await obniz.ble.scan.startWait();

```
