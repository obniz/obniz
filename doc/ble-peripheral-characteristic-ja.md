# BLE Peripheral - キャラクタリスティク



## new characteristic(json)

```Javascript
await obniz.ble.initWait(); 
var characteristic = new obniz.ble.characteristic({
    "uuid" : "FFF1",
    "properties" : ["read","write"],  // read, write, notify
    "data" : [0x0e, 0x00, ...],     //data for dataArray or  text for string
    "descriptors" : [{
        "uuid" : "2901",   //Characteristic User Description
        "text" : "hello world characteristic",    //data for dataArray or  text for string
    }]
});

var service = new obniz.ble.service({
                  "uuid" : "FFF0",
                  "characteristics" : [ characteristic ]
});
obniz.ble.peripheral.addService(service); 
   
```

<!--
## characteristic.write(data)
characteristicに値を書き込みます


## characteristic.onwrite(data)
characteristic.witeのコールバックです


```Javascript 

characteristic.write([0xf0,0x27]);
characteristic.onwrite = function(val){
    console.log("write :",val.result);
}


```
-->

## \[await] characteristic.writeWait(data)
characteristicに値を書き込みます
成功するとtrue,失敗するとfalseが返ります

```Javascript 
let result =  await characteristic.writeWait([0xf0,0x27]);

if(result){
    console.log("write success");
}

```

<!--
## characteristic.read(data)
characteristicの値を読み込みます

## characteristic.onread(data)
characteristic.readのコールバックです

```Javascript 

characteristic.read();
characteristic.onread = function(val){
    console.log("read data :",val.data);
}


```

-->

## \[await] characteristic.readWait()
characteristicの値を読み込みます
成功するとdataのはいったArrayが,失敗するとundefinedが返ります

```Javascript 
let data =  await characteristic.readWait()

console.log("data: " , data );


```

## characteristic.onwritefromremote(address, newvalue)
characteristicが外部から変更されたときのコールバックです

```Javascript 

characteristic.onwritefromremote = function(address, newvalue){
    console.log("remote address :",address);
    console.log("remote data :",newvalue);
}

```

## characteristic.onreadfromremote(address)
characteristicが外部からよまれたときのコールバックです

```Javascript 

characteristic.onreadfromremote = function(address){
    console.log("remote address :",address);	
}

```

## characteristic.notify()
接続済みのcentralに対してnotifyを出します．

```javascript
await obniz.ble.initWait(); 
var characteristic = new obniz.ble.characteristic({
  uuid: 'FFF1',
  data: [0x0e, 0x00],
  properties : ["read","write","notify"],  // add notify properties
 
});

var service = new obniz.ble.service({
  uuid: 'FFF0',
  characteristics: [characteristic],
});
obniz.ble.peripheral.addService(service);


// after central connected
characteristic.notify();

```
