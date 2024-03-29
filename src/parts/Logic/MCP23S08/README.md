# MCP23S08

SPI base I/O Expander

See [Reference](https://obniz.github.io/obniz/obnizjs/classes/parts.mcp23s08.mcp23s08.html)

## DEMO

[Optial In and Relay DEMO](https://codesandbox.io/s/obniz-plc-relay-iele2?file=/index.html)

## Example

```Javascript
// Javascript Example
const MCP23S08 = Obniz.getPartsClass("MCP23S08");
const mcp = this.obniz.wired("MCP23S08", {
  mosi: 23,
  miso: 19,
  clk: 18,
  cs: 32
});

// init all(0-7) io. default direction=Input
await mcp.initWait();

// set 4-7 to output
mcp.io7.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
mcp.io6.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
mcp.io5.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
mcp.io4.direction = MCP23S08.MCP23S08_IO_DIRECTION.OUTPUT;
// apply changes only for directions.
mcp.flushWait("direction"); // or mcp.flush("direction"); for no wait.

// output and apply the value immidiately
mcp.io4.output(true); // io4 of MCP23S08 is now ON.

// Read current input value.
await mcp.readAllGPIOWait();
console.log(`io0=${mcp.io0.value}`);
console.log(`io1=${mcp.io1.value}`);
console.log(`io2=${mcp.io2.value}`);
console.log(`io3=${mcp.io3.value}`);

```