# CIR415A

BLE経由で利用できるNFCリーダライターです

![](image.jpg)


## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (CIR415A.isDevice(p)) {
        console.log("found");
    }
};
```


## new CIR415A(BleRemotePeripheral)

BLEが受信した情報に基づいてインスタンスを作成します。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
  }
};
```

## [await]connectWait()

CIR415Aと接続を行います。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    }
    await device.connectWait();
  }
};
```

## [await]disconnectWait()

CIR415Aとの接続を切断します。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    await device.connectWait();
    await device.disconnectWait();
  }
};
```

## setMasterKey(key)

マスターキーを変更できます。
``connectWait``関数を実行する前に行ってください。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    device.setMasterKey([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    await device.connectWait();
  }
};
```

## setAutoPollingWait(enable)

NFCリーダが自動的にカードの有無状態に変更があるか確認してくれます。
``onAuthenticated``のコールバック関数が実行された後に行ってください。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    device.onAuthenticated = async () => {
        console.log("onAuthenticated");
        await device.setAutoPollingWait(true);
    };
    await device.connectWait();
  }
};
```

## writeADPU(data)

カードに対して、コマンドを実行できます。
``onAuthenticated``のコールバック関数が実行された後に行ってください。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    device.onAuthenticated = async () => {
        console.log("onAuthenticated");
        await device.setAutoPollingWait(true);
        await device.writeADPU([ 0xff, 0xca, 0x00, 0x00, 0x00]); // send apdu idm
    };
    await device.connectWait();
  }
};
```

## write(data)

CIR415Aに対して、コマンドを実行できます。
``onAuthenticated``のコールバック関数が実行された後に行ってください。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    device.onAuthenticated = async () => {
        console.log("onAuthenticated");
        await device.write([0x6b, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0xe0, 0x00, 0x00, 0x40, 0x01]);
    };
    await device.connectWait();
  }
};
```

## onNotify =  function (data){}

データを受信したら、そのデータをコールバック関数で返します。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    device.onNotify = async (data) => {
        console.log("onNotify");
        console.log(data);
        if (data[0] === 0x80) {
            //console.log("apdu event");
            console.log(data);
            let array = data.slice(7, 15);
            if(array.length !== 8){
                return ;
            }
            let idm = "";
            for (let i = 0; i < array.length - 1; i++) {
                idm +=  ("0" + array[i].toString(16)).slice(-2) + ":";
            }
            idm +=  ("0" + array[7].toString(16)).slice(-2);
            console.log(`Suica idm : ${idm}`);
        }
    };
    await device.connectWait();
  }
};
```


## onAuthenticated =  function (){}

認証が完了したらコールバック関数で返します。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    device.onAuthenticated = async () => {
        console.log("onAuthenticated");
        await device.setAutoPollingWait(true);
    };
    await device.connectWait();
  }
};
```

## onCardTouch =  function (touch){}

カードがタッチされるとコールバック関数で返します。タッチされたときにtrueを返します。

```javascript
// Javascript Example
const CIR415A = Obniz.getPartsClass('cir415a');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (CIR415A.isDevice(peripheral) ) {
    console.log("found");
    const device = new CIR415A(peripheral);
    device.onAuthenticated = async () => {
        console.log("onAuthenticated");
        await device.setAutoPollingWait(true);
    };
    device.onNotify = async (data) => {
        console.log("onNotify");
        console.log(data);
        if (data[0] === 0x80) {
            //console.log("apdu event");
            console.log(data);
            let array = data.slice(7, 15);
            if(array.length !== 8){
                return ;
            }
            let idm = "";
            for (let i = 0; i < array.length - 1; i++) {
                idm +=  ("0" + array[i].toString(16)).slice(-2) + ":";
            }
            idm +=  ("0" + array[7].toString(16)).slice(-2);
            console.log(`Suica idm : ${idm}`);
        }
    };
    device.onCardTouch = async (touch) =>{
        if(touch){
            console.log("card touch");
            await device.writeADPU([ 0xff, 0xca, 0x00, 0x00, 0x00]); // send apdu idm
        }else{
            console.log("card not touch");
        }
    };
    await device.connectWait();
  }
};
```
