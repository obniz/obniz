-- UDP example using the `net` module.
--
-- NOTE: UDP works over wifi / ethernet only. It is NOT supported on LTE
--       (cellular uses AT sockets), where net.udp.open returns nil, err.
--
-- net.udp.open([localPort])            -> id | nil, err   (omit localPort for ephemeral)
-- net.udp.sendTo(id, host, port, data) -> written | nil, err
-- net.udp.receive(id[, maxlen])        -> data, ip, port | nil (nothing received)
-- net.udp.close(id)
--
-- HOST/PORT are filled in by index.ts, which runs a local UDP echo server on
-- this machine, so running index.ts alone is enough to test end to end.

local HOST = "__SERVER_HOST__"
local PORT = __SERVER_PORT__

local sock = nil
local tick = 0
local seq = 0

function on_online_loop()
  if sock == nil then
    local id, err = net.udp.open(); -- ephemeral local port
    if not id then
      os.log("udpOpen error: " .. (err or "?"));
      sock = -1 -- mark as failed so we do not retry every loop
      return
    end
    sock = id
    os.log("UDP opened");
  end
  if sock == -1 then return end

  -- send a datagram every 3 seconds
  if os.getTick() - tick > 3000 then
    tick = os.getTick()
    seq = seq + 1
    local msg = "ping " .. seq
    local w, err = net.udp.sendTo(sock, HOST, PORT, msg);
    if w then
      os.log("sent: " .. msg);
    else
      os.log("send error: " .. (err or "?"));
    end
  end

  -- poll for incoming datagrams (non-blocking)
  local data, ip, port = net.udp.receive(sock);
  if data then
    os.log("recv from " .. ip .. ":" .. port .. " -> " .. data);
  end
end

function on_offline_loop()
  -- Network is required, so nothing to do while offline.
end
