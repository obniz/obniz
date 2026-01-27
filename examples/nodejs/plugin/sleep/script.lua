function on_event(event)
  if event == "power_on" then
    os.log(" - Light Sleep Start 3seconds. Tick="..os.getTick());
    os.sleep(3 * 1000, 3);
    os.log(" - Light Sleep Ended Tick="..os.getTick());
    os.log(" - During light sleep, tick does not counted");
  elseif event == "online" then
    os.log(" - Lua Online.");
  end
end


function on_command(command)
  os.log("Going to deep sleep 1sec");
  os.sleep(1 * 1000, 0);
end

-- os.sleep(5 * 1000, 0); deep sleep + external module sleep.
-- os.sleep(5 * 1000, 1); deep sleep + without external module sleep.
-- os.sleep(5 * 1000, 2); light sleep + external module sleep.
-- os.sleep(5 * 1000, 3); light sleep + without external module