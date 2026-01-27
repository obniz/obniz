function on_event(event)
  if event == "power_on" then
    os.log(" - Lua PowerOn");
    os.resetOnDisconnect(false);
    os.log(" - No Reset On Disconnect");
  elseif event == "setting_mode" then
  elseif event == "connecting_to_network" then
  elseif event == "connecting_to_cloud" then
  elseif event == "online" then
    os.log(" - Lua Online");
  end
end

function on_online_loop()
  os.log("now online");
end

function on_offline_loop()
  os.log("still offline...");
end