-- TCP example using the `net` module: send a raw HTTP request and read the reply.
--
-- net.tcpConnect(host, port[, secure]) -> id | nil, err   (secure = true for TLS)
-- net.tcpWrite(id, data)               -> written | nil, err
-- net.tcpRead(id[, maxlen])            -> data ("" = nothing yet) | nil (closed/error)
-- net.tcpClose(id)
--
-- tcpRead is non-blocking, so we poll it from on_online_loop.

local state = "idle"
local sock = nil
local tick = 0
local total = 0

function on_online_loop()
  if state == "idle" then
    os.log("TCP connecting ...");
    local id, err = net.tcpConnect("example.com", 80); -- use true as 3rd arg + port 443 for TLS
    if not id then
      os.log("connect error: " .. (err or "?"));
      state = "done"
      return
    end
    sock = id

    local w, werr = net.tcpWrite(sock,
      "GET / HTTP/1.0\r\nHost: example.com\r\nConnection: close\r\n\r\n");
    if not w then
      os.log("write error: " .. (werr or "?"));
      net.tcpClose(sock);
      state = "done"
      return
    end
    os.log("request sent (" .. w .. " bytes)");
    tick = os.getTick()
    state = "reading"

  elseif state == "reading" then
    local data = net.tcpRead(sock);
    if data == nil then
      -- nil = connection closed by peer (or error): we received everything
      os.log("TCP closed. total " .. total .. " bytes");
      net.tcpClose(sock);
      state = "done"
    elseif #data > 0 then
      if total == 0 then
        os.log("first chunk head: " .. data:sub(1, 80));
      end
      total = total + #data
    end

    -- safety timeout
    if state == "reading" and os.getTick() - tick > 15000 then
      os.log("TCP timeout");
      net.tcpClose(sock);
      state = "done"
    end
  end
end

function on_offline_loop()
  -- Network is required, so nothing to do while offline.
end
