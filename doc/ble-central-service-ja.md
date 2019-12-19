# BLE Central サービス

## service.uuid

サービスのuuidが文字列で格納されています

```javascript
console.log(service.uuid); // => '4C84'
```

## service.discoverAllCharacteristics()

サービスに登録されているキャラクタリスティクスを検索します。
キャラクタリスティクスは１つ見つかるごとに`ondiscovercharacteristic`に設定した関数が呼ばれ、すべての検索が完了すると`ondiscovercharacteristicfinished`に設定した関数が呼ばれます。

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      var connected = await peripheral.connectWait();

      if(connected){
        
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
      }else{
          console.log("connection failed");
      }
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
      var connected = await peripheral.connectWait();

      if(connected){
        
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
      }else{
          console.log("connection failed");
      }
    }
};

obniz.ble.scan.start();
```

## getCharacteristic(uuid)

uuidで指定したキャラクタリスティクスを取得します。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 

var target = {
    uuids: ["FFF0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    var connected = await peripheral.connectWait();
    
    if(connected){
        console.log("connected");
        await obniz.wait(1000);
    
        var dataArray = [0x02, 0xFF];
        var char = await peripheral.getService("FF00").getCharacteristic("FF01");
        console.log(char ? char.uuid : null)
    }
}

```

