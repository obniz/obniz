# Peripherals SPI
General Purpose SPI
spi0 and spi1 are available.
Max speed is 80Mhz.

## start({mode, clk, mosi, miso, frequency});
start spi. now mode is only "master"

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```
## [await] writeWait(data);
send a data to spi and wait until receive the data.
receive data length is same as sent data.

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```

## write(data);
just send a data to spi. no receive data arrived after sent.

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
obniz.spi0.write([0x12, 0x98]);
```

## end();
end spi

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000}); 
obniz.spi0.write([0x12, 0x98]);
obniz.spi0.end();
```