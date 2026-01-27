function on_event(event)
  if event == "power_on" then
    os.log(" - Lua PowerOn");
  elseif event == "setting_mode" then
  elseif event == "connecting_to_network" then
  elseif event == "connecting_to_cloud" then
  elseif event == "online" then
    os.log(" - Lua Online");
  end
end

-- function on_online_loop() 
--   os.log("online_loop");
-- end