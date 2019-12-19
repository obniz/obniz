# BLE Peripheral - ディスクリプタ


## new descriptor(json)

ディスクリプタを作成します


```Javascript
await obniz.ble.initWait(); 
var descriptor = new obniz.ble.characteristic({
                      "uuid" : "2901",   //Characteristic User Description
                      "text" : "hello world characteristic",
                  });

var characteristic = new obniz.ble.characteristic({
                    "uuid" : "FFF1",
                    "text" : "Hi",
                    "descriptors" : [ descriptor ]
                  });

var service = new obniz.ble.service({
                  "uuid" : "FFF0",
                  "characteristics" : [ characteristic ]
});
obniz.ble.peripheral.addService(service); 
   
```

<!--
## descriptor.write(data)
descriptorに値を書き込みます

## descriptor.onwrite(data)
descriptor.witeのコールバックです



```Javascript 

descriptor.write([0xf0,0x27]);
descriptor.onwrite = function(val){
    console.log("write :",val.result);
}


```
-->


## descriptor.writeWait(data)
descriptorに値を書き込みます
成功するとtrue,失敗するとfalseが返ります

```Javascript 
let result =  await descriptor.writeWait([0xf0,0x27]);

if(result){
    console.log("write success");
}

```
<!--

## descriptor.read(data)
descriptorの値を読み込みます

## descriptor.onread(data)
descriptor.readのコールバックです


```Javascript 

descriptor.read();
descriptor.onread = function(val){
    console.log("read data :",val.data);
}


```
-->

## \[await] descriptor.readWait()
descriptorに値を読み込みます
成功するとdataのはいったArrayが,失敗するとundefinedが返ります

```Javascript 
let data =  await descriptor.readWait()

console.log("data: " , data );


```

## descriptor.onwritefromremote
descriptorが外部から変更されたときのコールバックです


```Javascript 

descriptor.onwritefromremote = function(val){
    console.log("remote address :",val.address);
    console.log("remote data :",val.data);
}

```

## descriptor.onreadfromremote
descriptorが外部からよまれたときのコールバックです

```Javascript 

descriptor.onreadfromremote = function(val){
    console.log("remote address :",val.address);	
}

```



