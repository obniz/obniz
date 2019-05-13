# Peripherals UART
uart0 and uart1 are available

## obniz.getFreeUart()
It returns unused uart.
```javascript
var uart = obniz.getFreeUart();
```
It shows error when no more unused uart is available.
```javascript
var uart0 = obniz.getFreeUart();
var uart1 = obniz.getFreeUart();
var uart2 = obniz.getFreeUart(); // Error
```

## start({tx, rx[, gnd, baud, stop, bits, parity, flow control, rts, cts, drive, pull]})
It starts uart on io tx, rx.
tx is used for sending data from obniz to parts.
rx is used for receiving data from parts to obniz.
You can start uart without much configuration. Just use as below.
```javascript
obniz.uart0.start({tx:0, rx:1})
```
Default configurations are

Defaults
- 115200bps
- Async
- No Flow Control
- 8bit
- No Parity
- 1 Stop bit
- 5v push-pull drive
- No internal pull-up

Available configurations are

1. baud: number (default 115200)
2. stop: stop bit length 1(default)/1.5/2
3. bits: data bits 8(default)/5/6/7
4. parity: parity check "off"(default)/"odd"/"even"
5. flowcontrol: flow control "off"(default)/"rts"/"cts"/"rts-cts"
6. rts: io for rts
7. cts: io for cts
8. drive:  "3v","5v","open-drain"(See more detail at obniz.io.drive)
9. pull: null, "0v", "3v", "5v"(See more detail at obniz.io.pull)

```Javascript
// Javascript Example
obniz.io0.output(false) // for sharing GND.
obniz.uart0.start({tx: 1, rx: 2, baud:9600, bits:7 });
obniz.uart0.send("Hi");

obniz.uart1.start({tx: 3, rx: 4, cts:5, rts:6, flowcontrol: 'rts-cts'});
obniz.uart1.send("Hi");
```

## send(data)
This sends data.
Available formats are

- string => utf8 encoded byte array. Does not include null terminate
- number => will be one byte data
- array of number => array of bytes
- Buffer/Array => array of bytes

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})
obniz.uart0.send("Hi");
obniz.uart0.send(0x11);
obniz.uart0.send([0x11, 0x45, 0x44]);
```
## end()
It stops uart and releases io.

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})
obniz.uart0.send("Hi");
obniz.uart0.end();
```
## onreceive(data, text)
It is called when data is received.
Data is array of bytes.
Text is the same data but in text representation.

So, if obniz receives 'A'.  
Data is [0x41]  
Text is "A"  

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})
obniz.uart0.onreceive = function(data, text) {
  console.log(data);
  console.log(text);
}
obniz.uart0.send("Hello");
```

## isDataExists
It checks if there are data received but not yet used.
If there are, it returns true. 

If you are using onreceive callback, it will always be false because you receive the data with the callback function as the data arrives.


```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})

while(1){
    if(obniz.uart0.isDataExists()){
        console.log(obniz.uart0.readText());
    }
    await obniz.wait(10);  //wait for 10ms
}
```


## readByte
It returns the one byte that are received but not yet used.

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})

while(1){
    while(obniz.uart0.isDataExists()){
        console.log(obniz.uart0.readByte());
    }
    await obniz.wait(10);  //wait for 10ms
}
```

## readBytes
It returns the data array that are received but not yet used.

```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})

while(1){
    if(obniz.uart0.isDataExists()){
        console.log(obniz.uart0.readBytes());
    }
    await obniz.wait(10);  //wait for 10ms
}
```

## readText
It returns the data that are received but not yet used as string.


```Javascript
// Javascript Example
obniz.uart0.start({tx:0, rx:1})

while(1){
    if(obniz.uart0.isDataExists()){
        console.log(obniz.uart0.readText());
    }
    await obniz.wait(10);  //wait for 10ms
}
```