# BLE Central Service


## service.uuid

It is uuid as string.

```javascript
console.log(service.uuid); // => '4C84'
```

## service.discoverAllCharacteristics()

Searching characteristics in a service.
`ondiscovercharacteristic` will be called on each characteristics found. `ondiscovercharacteristicfinished` will be called when finished.

```Javascript
// Javascript Example
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
    console.log(peripheral.localName)
    if (peripheral.localName === 'my peripheral') {
      obniz.ble.scan.end();
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

This will be called when each characteristics found after `discoverAllCharacteristics()` called. 1st param is characteristics object.

## service.ondiscovercharacteristicfinished = () => {}

This will be called when `discoverAllCharacteristics()` finished.

## \[await] service.discoverAllCharacteristicsWait()

Search all characteristics in a serice and wait for results. It will return all found characteristics as an array.

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

return specified already found characteristics object.

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


