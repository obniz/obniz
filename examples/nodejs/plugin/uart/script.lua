

local tick = 0
local flag = false

os.log(" - Lua Start");
io.retain(1, true);
io.retain(2, true);
uart.start(1, 2, 115200); -- tx:io1 rx:io2 baud:115200
uart.send("Hello World");

function on_offline_loop()
  loop()
end

function on_online_loop()
  loop()
end

function loop()
  local ret = uart.recv();
  --  local ret = uart.recv(1); // limit receive buffer. max to 1 byte
  if #ret > 0 then
    -- EchoBack and send to cloud
    uart.send(ret);
    cloud.pluginSend(ret);
  end
end