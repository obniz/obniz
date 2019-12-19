# BLE Peripheral - Descriptor

## new descriptor(json)
This creates descriptor.

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
                  "uuid" : "fff0",
                  "characteristics" : [ characteristic ]
});
obniz.ble.peripheral.addService(service); 
   
```

<!--
## descriptor.write(data)
write on descriptor

## descriptor.onwrite(data)
callback of descriptor.wite



```Javascript 

descriptor.write([0xf0,0x27]);
descriptor.onwrite = function(val){
    console.log("write :",val.result);
}


```
-->

## descriptor.writeWait(data)
This writes data on descriptor.
It returns true when it succeeds and false when it fails.

```Javascript 
let result =  await descriptor.writeWait([0xf0,0x27]);

if(result){
    console.log("write success");
}

```
<!--
## descriptor.read(data)
read data on descriptor

## descriptor.onread(data)
callback of descriptor.read


```Javascript 

descriptor.read();
descriptor.onread = function(val){
    console.log("read data :",val.data);
}


```
-->

## \[await] descriptor.readWait()
This reads data on descriptor.
It returns data array when it succeeds and undefined when it fails.


```Javascript 
let data =  await descriptor.readWait()

console.log("data: " , data );


```


## descriptor.onwritefromremote

This is a callback function used when the descriptor gets changed by an external device.


```Javascript 

descriptor.onwritefromremote = function(val){
    console.log("remote address :",val.address);
    console.log("remote data :",val.data);
}

```

## descriptor.onreadfromremote
This is a callback function used when the descriptor is read by an external device.

```Javascript 

descriptor.onreadfromremote = function(val){
    console.log("remote address :",val.address);	
}

```







