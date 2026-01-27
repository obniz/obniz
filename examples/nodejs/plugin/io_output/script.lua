

local tick = 0
local flag = false

os.log(" - Lua PowerOn");
io.retain(1, true);
io.retain(2, true);

function on_offline_loop()
  loop()
end

function on_online_loop()
  loop()
end

function loop()
  if tick + 300 < os.getTick() then
    tick = os.getTick()
    io.output(1, flag);
    io.output(2, not flag);
    flag = not flag
  end
end