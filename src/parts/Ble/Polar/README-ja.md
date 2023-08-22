# Polar


## 対応モード
- ビーコンモード

## 使用例


```javascript
obniz.ble.scan.onfind = async function (peripheral: any) {
  if (Polar.isDevice(peripheral)) {
    console.log(Polar.getData(peripheral));
  }
};

await obniz.ble.scan.startWait();

// {
//   batteryStatus: true,
//   sensorContact: false,
//   advFrameCounter: 0,
//   broadcastBit: false,
//   sensorDataType: false,
//   statusFlags: false,
//   khzCode: 42,
//   fastAverageHr: 0,
//   slowAverageHr: 101
// }
```