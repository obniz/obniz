
# CheatSheet


## All command and events available on Lua Plugin

```lua

-- System Event Handler
function on_event(event)
  if event == "power_on" then
  elseif event == "setting_mode" then
  elseif event == "connecting_to_network" then
  elseif event == "connecting_to_cloud" then
  elseif event == "online" then
  end
end

-- func(int), module(int), data(string(uint8 array))
function on_upstream(func, module, data)
  if necessary then
    return 1;
  elseif rightnow then
    return 2;
  elseif mustDrop then
    cloud.upstreamEnqueue(1, 2, str); -- change to differenct command
    cloud.upstreamFlush(); -- optional
    return 0;
  end
end

-- received from obnis.js
function on_command(command)
  cloud.pluginSend("123");
end

-- called while online every around 1msec
function on_online_loop()
  -- os.log(\"online_loop\");
end

-- called while offline every around 1msec
-- You should care about communication because this function will be called
-- different thread.
function on_offline_loop()
  -- os.log(\"offline_loop\");
end

function on_self_check()
  os.log(" - self check ok");
end

function plugin_name()  -- will be get by obniz.plugin_name
  return "my_plugin"
end

-- Available Functions

-- OS
os.getTick(); -- system tick in msec 
os.getUnix(); -- get seconds from 1970/1/1. you must adjust time by calling pingWait();
os.log("hello world");
os.wait(1000); -- 1,000msec wait
os.reboot();
os.resetOnDisconnect(false); -- It will never reset after disconnection. And queued data never lost when offline.
os.sleep(5 * 1000, 0); -- deep sleep + external module sleep.
os.sleep(5 * 1000, 1); -- deep sleep + without external module sleep.
os.sleep(5 * 1000, 2); -- light sleep + external module sleep.
os.sleep(5 * 1000, 3); -- light sleep + without external module
os.getVersion();
os.getHW();

-- storage file
storage.fileOpen("text.txt")
storage.fileWrite("ABC");
storage.fileAppend("abcdefg");
length = storage.fileGetSize();
data = storage.fileRead(0, length);
storage.fileClose();

-- storage kvs
error = storage.kvsSave({ name = "Yuki", attr = { engineer = true } })
data = storage.kvsLoad();

-- Cloud
cloud.upstreamEnqueue(0, 1, data) -- module func data
cloud.pluginSend(data);
cloud.pluginSendFrameStart(frame_id, length); -- framing 
cloud.pluginSendFrameEnd(); -- framing 
cloud.enqueueTimestampByTick(os.getTick()-1000); -- it will enqueue unix timestamp

-- io
io.retain(1, true);
io.output(1, true);
local val = io.input(1);

-- ad
local val = ad.get(1); -- 0.0v~3.3v

-- uart
uart.start(1, 2, 9600)  -- tx:io1 rx:io2 baud:9600
uart.send("hello");
local data = uart.recv() -- uart.recv(1) limit to 1byte max
if #data > 1 then
  os.log(data); -- received
end

-- spi
local err = spi.start(20, 21, 19, 8, 100 * 1000); -- MOSI, MISO, CLK, CS(could be null for non shared SPI), baudrate
if err > 0 then
  os.log("SPI Error: " .. err);
  return
end
let result = spi.write(string.char(0x40, 0x00, 0xC0)); -- result must be 3bytes if success.

-- wifi
wifi.on();
wifi.off();
wifi.sniffStart(callback);
wifi.sniffSetChannel(2);
wifi.sniffStop();

-- ble
ble.on();
ble.off();
ble.scanStart(onFind, { -- default option values
  active=true,
  interval=16,
  window=16,
  phy1m=true,
  phyCoded=true,
  duplicate=true
});

```


## Plugin related obniz.js functions.


```typescript
// Lua scripting
console.log(obniz.plugin_name);
obniz.storage.savePluginLua(``);  // send text and store it on device
obniz.plugin!.reloadLua(); // reload stored Lua
obniz.plugin.execLua(``): // Execute Lua without store

// communication between Lua and javascript
obniz.plugin!.onFrameStart = (frame_id, length) => {
  console.log(`frame start id=${frame_id} length=${length}`);
}
obniz.plugin!.onFrameEnd = () => {
  console.log(`frame ended`);
}
obniz.plugin!.onreceive = (data) => {
  console.log(`received=${Buffer.from(data).toString()}`);
};
obniz.plugin!.send("Hello World"); // send binary to plugin. It will be received on `on_command()` in Lua.

// Management of clock for timestamp.
obniz.deviceTimestamp; // milliseconds
obniz.setClock();
obniz.setQueueMode({
  timestamp: 'unix_seconds', // millliseconds become 8bytes. or unix_seconds for 4 bytes. milliseconds alwasy 000.
  interval: 10 * 1000 // 10 seconds interval queue. 0 for realtime.
});
```