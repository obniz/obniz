-- TCP example using the `net` module: open a persistent connection and keep
-- exchanging data with the server every 3 seconds (HTTP has its own example).
--
-- net.tcp.connect(host, port[, secure]) -> id | nil, err   (secure = true for TLS)
-- net.tcp.write(id, data)               -> written | nil, err
-- net.tcp.read(id[, maxlen])            -> data ("" = nothing yet) | nil (closed/error)
-- net.tcp.close(id)
--
-- net.tcp.read is non-blocking, so we poll it from on_online_loop.
--
-- HOST/PORT are filled in by index.ts, which runs a local TCP server on this
-- machine, so running index.ts alone is enough to test end to end.

local HOST = "__SERVER_HOST__"
local PORT = __SERVER_PORT__

local sock = nil
local tick = 0
local seq = 0

function on_online_loop()
  -- Open the connection once and keep it open.
  if sock == nil then
    os.log("TCP connecting ...");
    local id, err = net.tcp.connect(HOST, PORT); -- use true as 3rd arg + a TLS port for TLS
    if not id then
      os.log("connect error: " .. (err or "?"));
      sock = -1 -- mark as failed so we do not retry every loop
      return
    end
    sock = id
    os.log("TCP connected");
  end
  if sock == -1 then return end

  -- send a message every 3 seconds
  if os.getTick() - tick > 3000 then
    tick = os.getTick()
    seq = seq + 1
    local msg = "ping " .. seq .. "\n"
    local w, err = net.tcp.write(sock, msg);
    if w then
      os.log("sent: ping " .. seq);
    else
      os.log("write error: " .. (err or "?"));
    end
  end

  -- poll for incoming data (non-blocking)
  local data = net.tcp.read(sock);
  if data == nil then
    -- nil = connection closed by peer (or error)
    os.log("TCP closed by server");
    net.tcp.close(sock);
    sock = -1
  elseif #data > 0 then
    os.log("recv: " .. data:gsub("%s+$", ""));
  end
end

function on_offline_loop()
  -- Network is required, so nothing to do while offline.
end
