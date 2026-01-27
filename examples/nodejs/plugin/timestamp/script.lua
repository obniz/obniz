

function on_command(command)
  os.log("command received: " .. command);

  -- simple response
  cloud.enqueueTimestampByTick(current);
  cloud.pluginSend("last sent time");
end

tick = 0

function on_online_loop() 
  local current = os.getTick()
  if tick == 0 then
    tick = current
  end
  if current - tick >= 3 * 1000 then
    tick = current
    os.log(" - 3 seconds passed");

    -- add old data with data retrieval timestamp
    cloud.enqueueTimestampByTick(current-1000);
    cloud.pluginSend("this is 1 sec old data");

    -- just add simple timestamp
    cloud.enqueueTimestampByTick(current);
    cloud.pluginSend("now");
  end
end