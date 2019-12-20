
# BLE Central ディスクリプタ

## \[await] descriptor.writeWait(dataArray)
descriptorにdataArrayを書き込みます
失敗するとエラーがthrowされます。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = [0x02, 0xFF];
    await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeWait(dataArray);
    console.log("write success");
}

```


## \[await] descriptor.writeNumber(value)
descriptorに数字を1byteとしてを書き込みます
失敗するとエラーがthrowされます。

```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeNumberWait(100);
    console.log("write success");
}
```



## \[await] descriptor.writeText(str)
descriptorに文字列を書き込みます
失敗するとエラーがthrowされます。


```Javascript
// Javascript Example

await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    await peripheral.getService("FF00").getCharacteristic("FF01").getDescriptor("2901").writeTextWait("My Name");
    console.log("write success");
}
```
<!-- 
## characteristic.onwrite
characteristicに書き込みが完了したときに呼ばれます


```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){

        peripheral.onconnect = function(){
            var characteristic = peripheral.getService("FF00").getCharacteristic("FF01");
            characteristic.writeText("My Name");
            characteristic.onwrite = function(resutls){
                console.log(results); //"success" or "failed"
            }
        }
        peripheral.connect();
    }
}
obniz.ble.scan.start();
```
-->

## \[await] descriptor.readWait()
descriptorからデータを読み込みます
読み込みに成功するとデータの入ったArrayが返ります。
失敗するとエラーがthrowされます。

```Javascript
// Javascript Example
await obniz.ble.initWait(); 
var target = {
    uuids: ["fff0"],
};
var peripheral = await obniz.ble.scan.startOneWait(target);
if(peripheral){
    await peripheral.connectWait();
    console.log("connected");
    await obniz.wait(1000);

    var dataArray = await peripheral.getService("FF00").getCharacteristic("FF01").readWait();
    console.log(dataArray);
}
```


<!--
## descriptor.onread
descriptorからデータを読み込出したときに呼ばれます

```Javascript
// Javascript Example
obniz.ble.scan.onfind = function(peripheral){
    if(peripheral.localName == "my peripheral"){

        peripheral.onconnect = function(){
            var characteristic = peripheral.getService("FF00").getCharacteristic("FF01");
            characteristic.read();
            characteristic.onread = function(dataArray){
                console.log("value : " + dataArray);
            }
        }

        peripheral.connect();
    }
}
obniz.ble.scan.start();
```
-->

