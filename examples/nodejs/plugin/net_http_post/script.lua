-- HTTP example using the `net` module: read the AD (voltage) value of io1 and
-- POST it to the server every 3 seconds.
--
-- ad.get(io)                              -> voltage (number)
-- net.http.post(url, body[, contentType]) -> status, body, headers | nil, err
--
-- On failure the first return value is nil and the second is an error string.
--
-- BASE is filled in by index.ts, which runs a local HTTP server on this
-- machine, so running index.ts alone is enough to test end to end.

local BASE = "http://__SERVER_HOST__:__SERVER_PORT__"

local tick = 0
local seq = 0

function on_online_loop()
  -- POST the io1 voltage every 3 seconds.
  if os.getTick() - tick < 3000 then return end
  tick = os.getTick()
  seq = seq + 1

  local voltage = ad.get(1) -- read AD value of io1 (volts)
  local body = string.format('{"seq":%d,"io":1,"voltage":%.3f}', seq, voltage)

  local status, resp = net.http.post(BASE .. "/ad", body, "application/json");
  if status then
    os.log("POST io1=" .. string.format("%.3f", voltage) .. "V -> " .. status);
  else
    os.log("POST error: " .. (resp or "?")); -- resp holds the error string here
  end
end

function on_offline_loop()
  -- Network is required, so nothing to do while offline.
end
