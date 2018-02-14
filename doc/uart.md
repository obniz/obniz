# Peripherals UART
uart0 and uart1 is available

## start(tx, rx, baud, stop, bits, parity, flow control, rts, cts)
start uart on io tx, rx.
tx is used for send data from obniz to parts.
rx is used for receive data from parts to obniz.
you can start uart without many configration. Just use like
```javascript
obniz.uart0.start(0, 1)
```
default configrations are

Defaults
- 115200bps
- Async
- Now Flow Control
- 8bit
- No Parity
- 1 Stopbit

available configrations are

1. baud: number (default 115200)
2. stop: stopbit length 1(default)/1.5/2
3. bits: data bits 8(default)/5/6/7
4. parity: paritty check "off"(default)/"odd"/"even"
5. flowcontrol: flow control "off"(default)/"rts"/"cts"/"rts-cts"
6. rts: io for rts
7. cts: io for cts


```Javascript
// Example
obniz.uart0.start(1, 2, 9600, null, 7);  // speed changed to 9600. bits = 7bit
obniz.uart0.send("Hi");
```
## send(data)
send a data.
available formats are

- string => utf8 encoded byte array. not include null terminate
- number => will be one byte data
- array of number => array of bytes
- Buffer/Array => array of bytes

```Javascript
// Example
obniz.uart0.start(0, 1); // 0 is output, 1 is input
obniz.uart0.send("Hi");
obniz.uart0.send(0x11);
obniz.uart0.send([0x11, 0x45, 0x44]);
```
## end()
stop uart. it will release io.

```Javascript
// Example
obniz.uart0.start(0, 1);
obniz.uart0.send("Hi");
obniz.uart0.end();
```
## onreceive(data, text)
callback function when data recieved.
data is array of bytes.
text is same data. but it was text representation.

So, if obniz receive 'A'.  
data is [0x41]  
text is "A"  

```Javascript
// Example
obniz.uart0.start(0, 1); // 0 is output, 1 is input
obniz.uart0.onreceive = function(data, text) {
  console.log(data);
  console.log(text);
}
obniz.uart0.send("Hello");
```

## isdataexists
check data  which recieved and you don't get yet.
If it available, return true. 

if you are using onreceive callback, it always false because you get data from callback function.


```Javascript
// Example
obniz.uart0.start(0, 1); // 0 is output, 1 is input

while(1){
    if(obniz.uart0.isdataexists){
        console.log(obniz.uart0.readtext());
    }
    obniz.wait(10);  //wait for 10ms
}
```

## readbytes
return received data array which recieved and you don't get yet.

```Javascript
// Example
obniz.uart0.start(0, 1); // 0 is output, 1 is input

while(1){
    if(obniz.uart0.isdataexists){
        console.log(obniz.uart0.readbytes());
    }
    obniz.wait(10);  //wait for 10ms
}
```

## readtext
return received data as string which recieved and you don't get yet.


```Javascript
// Example
obniz.uart0.start(0, 1); // 0 is output, 1 is input

while(1){
    if(obniz.uart0.isdataexists){
        console.log(obniz.uart0.readtext());
    }
    obniz.wait(10);  //wait for 10ms
}
```