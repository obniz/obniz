
function on_event(event)
  if event == "power_on" then
    os.log(" - Lua PowerOn");
    os.resetOnDisconnect(false);
    cloud.disconnect();
  elseif event == "setting_mode" then
  elseif event == "connecting_to_network" then
  elseif event == "connecting_to_cloud" then
  elseif event == "online" then
    os.log(" - Lua Online");
  end
end

local lastTick = os.getTick();
local connecting = false;
local offlineTick = 0;

function on_offline_loop()
  if os.getTick() - lastTick > 1000 then
    lastTick = os.getTick();
    os.log("offline loop");
    wdt.feed();
  end
  if os.getTick() - offlineTick > 10 * 1000 and not connecting then
    os.log("connect to cloud");
    cloud.connect();
    connecting = true;
  end
end

function on_command(command)
  os.log("disconnect from cloud");
  cloud.disconnect();
  connecting = false;
  offlineTick = os.getTick();
end