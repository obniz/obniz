# BLE Central サービス

## service.uuid

サービスのuuidが文字列で格納されています

```javascript
console.log(service.uuid); // => '4C84'
```
<!--
## service.discoverAllCharacteristics()

サービスに登録されているキャラクタリスティクスを検索します。
キャラクタリスティクスは１つ見つかるごとに`ondiscovercharacteristic`に設定した関数が呼ばれ、すべての検索が完了すると`ondiscovercharacteristicfinished`に設定した関数が呼ばれます。

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      await peripheral.connectWait();
      peripheral.ondiscoverservice = function (service) {
            console.log('service UUID:' + service.uuid);

            if (service.uuid === 'my service'){

              service.ondiscovercharacteristic = function (chara) {
                console.log('char:' + chara.uuid);
              }

              service.ondiscovercharacteristicfinished = function () {
                console.log('character discovery finish')
              }

              console.log("will scan characteristics")
              service.discoverAllCharacteristics();
            }
          }
        
          peripheral.ondiscoverservicefinished = function () {
            console.log("service discovery finished")
          }
        
          peripheral.discoverAllServices();
    }
};

obniz.ble.scan.start();
```

## service.ondiscovercharacteristic = (characteristics) => {}

`discoverAllCharacteristics()`でキャラクタリスティクスが見つかった場合に呼ばれる関数を設定できます。引数にはキャラクタリスティクスのオブジェクトが入ります。

## service.ondiscovercharacteristicfinished = () => {}

`discoverAllCharacteristics()`が完了した際に呼ばれる関数を設定できます。

## \[await] service.discoverAllCharacteristicsWait()

サービスに登録されているキャラクタリスティクスを全て検索し、検索が完了するまで待機します。
見つかったキャラクタリスティクスを配列で返します。

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      obniz.ble.scan.end();
      await peripheral.connectWait();
var services = await peripheral.discoverAllServicesWait();
          for (var service of services) {
            console.log('service UUID: ' + service.uuid)
            if (service.uuid === 'my srevice uuid'){
              var chars = await service.discoverAllCharacteristicsWait();
              for (var char of chars) {
                  console.log('charactor UUID: ' + char.uuid)
              }
            }
          }
    }
};

obniz.ble.scan.start();
```
-->

## service.characteristics

サービスに含まれるキャラクタリスティクスの一覧の配列です。
接続時に自動検索され、代入されています。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(!peripheral) {
    console.log('no such peripheral')
    return;
}
try {
  await peripheral.connectWait();
  console.log("connected");
  var service = peripheral.getService("1800")
  for (var c of service.characteristics) {
    console.log(c.uuid)
  }
} catch(e) {
  console.error(e);
}
```

## service.getCharacteristic(uuid: string)

サービスに含まれるキャラクタリスティクスのうち、uuidで文字列で指定したキャラクタリスティクスを取得します。存在しない場合はnullが返ります。

uuidの大文字と小文字は区別されません。`aa00`と`AA00`は同じです。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(!peripheral) {
    console.log('no such peripheral')
    return;
}
try {
  await peripheral.connectWait();
  console.log("connected");
  var service = peripheral.getService("1800")
  var c = service.getCharacteristic("fff0")
  console.log(c.uuid)
} catch(e) {
  console.error(e);
}
```

