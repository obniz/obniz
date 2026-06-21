

function on_command(command)
  os.log("command received:" .. command);

  local resp, status = lte.at(command);
  os.log("response: " .. resp);
  os.log("status: " .. tostring(status));

  -- simple response
  cloud.pluginSend(resp);
end