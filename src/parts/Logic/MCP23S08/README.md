# MCP23S08

SPI base I/O Expander

See [Reference](https://obniz.github.io/obniz/obnizjs/classes/parts.mcp23s08.mcp23s08.html)

Example

```Javascript
// Javascript Example
const mcp = this.obniz.wired("MCP23S08", {
  mosi: 23,
  miso: 19,
  clk: 18,
  cs: 32
});

// init all(0-7) io. default direction=Input
await mcp.initWait();

// set 4-7 to output
mcp.io7.direction = MCP23S08_IO_DIRECTION.OUTPUT;
mcp.io6.direction = MCP23S08_IO_DIRECTION.OUTPUT;
mcp.io5.direction = MCP23S08_IO_DIRECTION.OUTPUT;
mcp.io4.direction = MCP23S08_IO_DIRECTION.OUTPUT;
// apply changes only for directions.
mcp.flushWait("direction"); // or mcp.flush("direction"); for no wait.

// output and apply the value immidiately
mcp.io4.output(true); // io4 of MCP23S08 is now ON.

// Read current input value.
console.log(`io0=${await mcp.io0.inputWait()}`);

```