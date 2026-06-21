-- UDP example using the `net` module.
--
-- NOTE: UDP works over wifi / ethernet only. It is NOT supported on LTE
--       (cellular uses AT sockets), where net.udpOpen returns nil, err.
--
-- net.udpOpen([localPort])            -> id | nil, err   (omit localPort for ephemeral)
-- net.udpSendTo(id, host, port, data) -> written | nil, err
-- net.udpReceive(id[, maxlen])        -> data, ip, port | nil (nothing received)
-- net.udpClose(id)
--
-- Point HOST/PORT at a UDP echo server on your network to see replies.

local HOST = "192.168.0.2"
local PORT = 9000

local sock = nil
local tick = 0
local seq = 0

function on_online_loop()
  if sock == nil then
    local id, err = net.udpOpen(); -- ephemeral local port
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
    local w, err = net.udpSendTo(sock, HOST, PORT, msg);
    if w then
      os.log("sent: " .. msg);
    else
      os.log("send error: " .. (err or "?"));
    end
  end

  -- poll for incoming datagrams (non-blocking)
  local data, ip, port = net.udpReceive(sock);
  if data then
    os.log("recv from " .. ip .. ":" .. port .. " -> " .. data);
  end
end

function on_offline_loop()
  -- Network is required, so nothing to do while offline.
end
