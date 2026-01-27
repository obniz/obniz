

function on_offline_loop()
  loop()
end

function on_online_loop()
  loop()
end

function loop()
  io.output(1, io.input(2));
end

os.log(" - Lua Start");
io.retain(1, true);
io.retain(2, true);