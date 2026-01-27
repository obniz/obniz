function plugin_name()
  return "i2c_test"  -- max 30 chars
end

function on_event(event)
  if event == "power_on" then
    os.log(" - Lua PowerOn");
    
    init();
  end
end

local tick = 0
local initialized = false

function init()
  if initialized then
    return
  end
  initialized = true

  io.retain(1, true);
  io.retain(2, true);
  local err = i2c.start(1, 2, 100 * 1000); -- SDA, SCL, baudrate
  if err > 0 then
    os.log("I2C Error: " .. err);
    return
  end
  os.log("I2C Started");
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

  end
end
