-- MQTT example: a tiny MQTT 3.1.1 client implemented on top of net.tcp.
--
-- It connects to the local broker started by index.ts, subscribes to a
-- downlink topic, and publishes to an uplink topic every 3 seconds. Incoming
-- PUBLISH packets from the broker are decoded and logged.
--
-- Only QoS 0 is implemented, which keeps the wire format simple (no packet
-- identifiers, no retransmission).
--
-- HOST/PORT are filled in by index.ts, which runs a local MQTT broker on this
-- machine, so running index.ts alone is enough to test end to end.

local HOST = "__SERVER_HOST__"
local PORT = __SERVER_PORT__

local TOPIC_UP = "obniz/up"     -- device -> broker
local TOPIC_DOWN = "obniz/down" -- broker -> device
local CLIENT_ID = "obniz-lua"
local KEEP_ALIVE = 60           -- seconds

-- ---- MQTT encoding helpers ------------------------------------------------

-- Remaining length is encoded as a base-128 varint.
local function encode_remaining_length(len)
  local out = {}
  repeat
    local b = len % 128
    len = math.floor(len / 128)
    if len > 0 then b = b + 128 end
    out[#out + 1] = string.char(b)
  until len == 0
  return table.concat(out)
end

-- UTF-8 strings are prefixed with a 2-byte big-endian length.
local function encode_string(s)
  local n = #s
  return string.char(math.floor(n / 256), n % 256) .. s
end

local function make_packet(first_byte, payload)
  return string.char(first_byte) .. encode_remaining_length(#payload) .. payload
end

local function connect_packet()
  local vh = encode_string("MQTT")          -- protocol name
    .. string.char(0x04)                    -- protocol level (3.1.1)
    .. string.char(0x02)                    -- connect flags: clean session
    .. string.char(math.floor(KEEP_ALIVE / 256), KEEP_ALIVE % 256)
  local payload = encode_string(CLIENT_ID)
  return make_packet(0x10, vh .. payload)
end

local function subscribe_packet(topic, packet_id)
  local vh = string.char(math.floor(packet_id / 256), packet_id % 256)
  local payload = encode_string(topic) .. string.char(0x00) -- requested QoS 0
  return make_packet(0x82, vh .. payload)
end

local function publish_packet(topic, message)
  -- QoS 0: variable header is just the topic, no packet identifier.
  return make_packet(0x30, encode_string(topic) .. message)
end

local PINGREQ = string.char(0xC0, 0x00)

-- Decode a remaining-length varint from `buf` starting at byte index `i`.
-- Returns value, number_of_length_bytes, or nil when incomplete.
local function decode_remaining_length(buf, i)
  local multiplier = 1
  local value = 0
  local bytes = 0
  while true do
    if i + bytes > #buf then return nil end
    local b = buf:byte(i + bytes)
    value = value + (b % 128) * multiplier
    bytes = bytes + 1
    if b < 128 then break end
    multiplier = multiplier * 128
    if bytes >= 4 then return nil end -- malformed
  end
  return value, bytes
end

-- ---- Client state ---------------------------------------------------------

local sock = nil
local state = "idle" -- idle -> connecting -> ready -> failed
local rxbuf = ""
local pub_tick = 0
local ping_tick = 0
local packet_id = 0
local seq = 0

local function handle_packet(ptype, packet, vh)
  if ptype == 2 then
    -- CONNACK: byte vh+1 is the return code (0 = accepted)
    if packet:byte(vh + 1) == 0 then
      os.log("MQTT connected, subscribing to " .. TOPIC_DOWN);
      packet_id = packet_id + 1
      net.tcp.write(sock, subscribe_packet(TOPIC_DOWN, packet_id));
      state = "ready"
      ping_tick = os.getTick()
    else
      os.log("MQTT connection refused");
      state = "failed"
    end
  elseif ptype == 9 then
    os.log("MQTT subscribed");
  elseif ptype == 3 then
    -- PUBLISH from broker (QoS 0): topic then payload, no packet id.
    local topic_len = packet:byte(vh) * 256 + packet:byte(vh + 1)
    local topic = packet:sub(vh + 2, vh + 1 + topic_len)
    local message = packet:sub(vh + 2 + topic_len)
    os.log("MQTT recv [" .. topic .. "] " .. message);
  elseif ptype == 13 then
    -- PINGRESP, nothing to do.
  end
end

-- Pull every complete packet out of rxbuf and dispatch it.
local function process_rx()
  while #rxbuf >= 2 do
    local first = rxbuf:byte(1)
    local ptype = math.floor(first / 16)
    local rlen, lenbytes = decode_remaining_length(rxbuf, 2)
    if rlen == nil then break end -- length field not fully arrived
    local total = 1 + lenbytes + rlen
    if #rxbuf < total then break end -- full packet not arrived yet
    local packet = rxbuf:sub(1, total)
    rxbuf = rxbuf:sub(total + 1)
    handle_packet(ptype, packet, 2 + lenbytes) -- variable header start index
  end
end

function on_online_loop()
  -- 1) Connect and send CONNECT once.
  if state == "idle" then
    os.log("MQTT connecting to " .. HOST .. ":" .. PORT);
    local id, err = net.tcp.connect(HOST, PORT);
    if not id then
      os.log("connect error: " .. (err or "?"));
      state = "failed"
      return
    end
    sock = id
    net.tcp.write(sock, connect_packet());
    state = "connecting"
    return
  end
  if state == "failed" then return end

  -- 2) Read whatever arrived and dispatch complete packets.
  local data = net.tcp.read(sock);
  if data == nil then
    os.log("MQTT connection closed");
    net.tcp.close(sock);
    state = "failed"
    return
  elseif #data > 0 then
    rxbuf = rxbuf .. data
    process_rx()
  end

  if state ~= "ready" then return end

  -- 3) Publish to the uplink topic every 3 seconds.
  if os.getTick() - pub_tick > 3000 then
    pub_tick = os.getTick()
    seq = seq + 1
    local msg = "uptime " .. math.floor(os.getTick() / 1000) .. "s #" .. seq
    net.tcp.write(sock, publish_packet(TOPIC_UP, msg));
    os.log("MQTT sent [" .. TOPIC_UP .. "] " .. msg);
  end

  -- 4) Keep the connection alive with PINGREQ.
  if os.getTick() - ping_tick > KEEP_ALIVE * 1000 / 2 then
    ping_tick = os.getTick()
    net.tcp.write(sock, PINGREQ);
  end
end

function on_offline_loop()
  -- Network is required, so nothing to do while offline.
end
