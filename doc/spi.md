# Peripherals SPI
General Purpose SPI
spi0 and spi1 are available.
Max speed is 80Mhz.

## start(mode, io_clk, io_mosi, io_miso, frequency);
start spi. now mode is only "master"

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start("master", 0, 1, 2, 1000000); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```
## [await] writeWait(data);
send a data to spi and wait until receive the data.
receive data length is same as sent data.

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start("master", 0, 1, 2, 1000000); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```