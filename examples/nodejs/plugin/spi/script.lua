function plugin_name()
  return "spi_test"  -- max 30 chars
end

function on_event(event)
  if event == "power_on" then
    os.log(" - Lua PowerOn");
    
    init();
  end
end

local tick = 0
local flag = false
local initialized = false

function init()
  if initialized then
    return
  end
  initialized = true

  -- Kilo Internal Shared SPI for MCP23S08
  io.retain(8, true); -- CLK
  local err = spi.start(20, 21, 19, 8, 100 * 1000); -- MOSI, MISO, CLK, CS(could be null for non shared SPI), baudrate
  if err > 0 then
    os.log("SPI Error: " .. err);
    return
  end
  os.log("SPI Started");
  -- Writeaddress / Direction Address / 
  spi.write(string.char(0x40, 0x00, 0xC0)); -- Change Direction of IO.
end

init();

function on_offline_loop()
  loop()
end

function on_online_loop()
  loop()
end

tick = 0;

function loop()
  local current = os.getTick()
  if tick == 0 then
    tick = current
  end
  if current - tick >= 3 * 1000 then
    tick = current
    if flag then
      local ret = spi.write(string.char(0x40, 0x09, 0x3C)); -- Relay On
      os.log("Relay On: ");
    else
      local ret = spi.write(string.char(0x40, 0x09, 0x1C)); -- Relay Off
      os.log("Relay Off: ");
    end

    flag = not flag
  end
end
