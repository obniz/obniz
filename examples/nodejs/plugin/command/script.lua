

function on_command(command)
  os.log("command received: " .. command);

  -- simple response
  cloud.pluginSend("pong");

  -- framed response
  cloud.pluginSendFrameStart(1, 6);
  cloud.pluginSend("fra");
  cloud.pluginSend("med");
  cloud.pluginSendFrameEnd();
end