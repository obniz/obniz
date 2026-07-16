
local store = {}
local stop_accumulating = false

function on_low_memory()
  os.log("Low memory warning received from device! count=" .. #store)
  -- Release everything we accumulated so far.
  store = {}
  os.log("store cleared. count=" .. #store)

  -- Once low memory happens, stop accumulating from now on.
  stop_accumulating = true

  -- GC will triggered by obnizOS. But you can also trigger it manually if you want to.
  -- collectgarbage()
end

function on_offline_loop()
  loop()
end

function on_online_loop()
  loop()
end

function loop()
  -- Once a low memory warning has occurred, stop accumulating.
  if stop_accumulating then
    return
  end

  -- Keep appending new entries to the table so memory keeps growing
  -- until the device fires a low memory warning.
  store[#store + 1] = "obniz is testing memory expansion. " .. tostring(#store)
end

os.log("Lua script started");
