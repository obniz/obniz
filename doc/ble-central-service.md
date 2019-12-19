# BLE Central Service


## service.uuid

It is uuid as string.

```javascript
console.log(service.uuid); // => '4C84'
```

<!--
## service.discoverAllCharacteristics()

Searching characteristics in a service.
`ondiscovercharacteristic` will be called on each characteristics found. `ondiscovercharacteristicfinished` will be called when finished.

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

-->

## service.characteristics

It contains characteristics in a service.
It was discovered when connection automatically.

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["FFF0"],
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

It returns a characteristic which having specified uuid in a service.
Return value is null when not matched.

Case is ignored. So `aa00` and `AA00` are the same.

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["FFF0"],
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
  var c = service.getCharacteristic("FFF0")
  console.log(c.uuid)
} catch(e) {
  console.error(e);
}
```


