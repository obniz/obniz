function on_event(event)
  if event == "power_on" then
    os.log("initialized called");
  end
end

function init()
  os.log("init called");
end

init();