# MiniBreeze
SENKO社製の温湿度・ガスセンサです。

![](./image.jpg)


## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、MiniBreeze かどうかを判定します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const MiniBreeze = Obniz.getPartsClass("MiniBreeze");
obniz.ble.scan.onfind = async (peripheral) => {
  if (MiniBreeze.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```


## getData()
BLEで受信したアドバタイズ情報をもとに、温湿度・ガスデータを取得します。
違うSLOTのアドバタイズ情報の場合はnullを返します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const MiniBreeze = Obniz.getPartsClass("MiniBreeze");
obniz.ble.scan.onfind = (peripheral) => {
  if (MiniBreeze.isDevice(peripheral)) {
    const data = MiniBreeze.getData(peripheral);
    console.log(data); 
  }
};
await obniz.ble.scan.startWait();

```

返り値のフォーマットは下記のとおりです。

```javascript
{
  gasType: "none" | "HCHO" | "CO" | "CO2" | "Rn" | "PM1.0" | "PM2.5" | "PM10" | "unknown";
  sensVal: number;
  temperature: number;
  humidity: number;
  version: string;
  status: "BatteryEmpty" | "BatteryLow" | "BatteryNormal" | "BatteryCharging" | "Invalid";
  devName: string;
}
```

