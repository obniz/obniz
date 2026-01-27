

function on_offline_loop()
  loop()
end

function on_online_loop()
  loop()
end

local flag = false

os.log(" - Lua Start");
io.retain(1, true);

function loop()
  os.wait(100);
  os.log("AD1: " .. ad.get(1) .. "v");
end
