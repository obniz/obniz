

local function u8(s, i)  return string.byte(s, i) end
local function be16(b1, b2) return b1 * 256 + b2 end  -- iBeaconのMajor/Minorはビッグエンディアン

-- AD構造を走査して Manufacturer Specific Data (type=0xFF) を返す
local function find_msd(ad)
  local i, n = 1, #ad
  while i <= n do
    local len = u8(ad, i); if not len or len == 0 then break end
    local t   = u8(ad, i+1)
    if not t then break end
    if t == 0xFF then
      return ad:sub(i+2, i+1+len)  -- [length(1)][type(1)][data(len-1)] → data部
    end
    i = i + 1 + len
  end
  return nil
end

-- iBeacon判定＆抽出: 戻り値 {uuid=hex, major=number, minor=number, tx_power=signed}
local function parse_ibeacon_from_ad(ad)
  local msd = find_msd(ad)
  if not msd or #msd < 25 then return nil end
  -- iBeacon: CompanyID(2) = 0x004C (LE) / type(1)=0x02 / len(1)=0x15 / uuid(16) / major(2) / minor(2) / tx(1)
  local cid_lo, cid_hi = u8(msd,1), u8(msd,2)               -- little-endian 0x4C00
  local itype, ilen    = u8(msd,3), u8(msd,4)
  if cid_lo ~= 0x4C or cid_hi ~= 0x00 or itype ~= 0x02 or ilen ~= 0x15 then
    return nil
  end
  local uuid_bytes = {msd:byte(5, 20)}
  -- UUIDを一般的な16進表記に
  local function hex(bytes) return (string.gsub(string.char(table.unpack(bytes)), ".", function(c) return string.format("%02X", string.byte(c)) end)) end
  local raw = hex(uuid_bytes)
  local uuid = string.format("%s-%s-%s-%s-%s",
    raw:sub(1,8), raw:sub(9,12), raw:sub(13,16), raw:sub(17,20), raw:sub(21,32))
  local maj = be16(u8(msd,21), u8(msd,22))
  local min = be16(u8(msd,23), u8(msd,24))
  local tx  = (u8(msd,25) >= 0x80) and (u8(msd,25)-256) or u8(msd,25)
  return {uuid=uuid, major=maj, minor=min, tx_power=tx}
end

-- アドレスを人間可読 "AA:BB:CC:DD:EE:FF" に
local function format_addr_le6(b1,b2,b3,b4,b5,b6, reverse)
  local t
  if reverse then -- HCIはEF 36 F1 76 D2 27の順で来るので、表示は逆順が一般的
    t = {b6,b5,b4,b3,b2,b1}
  else
    t = {b1,b2,b3,b4,b5,b6}
  end
  return string.format("%02X:%02X:%02X:%02X:%02X:%02X", table.unpack(t))
end

-- ====== HCI LE Advertising Report / Extended Advertising Report から {addr, rssi, ad} を取り出す ======
-- 入力は HCI Eventパケットのバイナリ文字列（先頭0x04から）
local function parse_one_report(hci_bytes)
  if #hci_bytes < 3 then return nil, "too short" end
  local ptype = u8(hci_bytes,1)          -- 0x04
  local evt   = u8(hci_bytes,2)          -- 0x3E = LE Meta Event
  if ptype ~= 0x04 or evt ~= 0x3E then return nil, "not LE meta event" end
  -- param length = hci_bytes:byte(3) -- 未使用
  local subevt = u8(hci_bytes,4)
  if subevt == 0x02 then
    -- LE Advertising Report (legacy)
    local idx = 5
    local num = u8(hci_bytes, idx); idx = idx + 1
    if num ~= 1 then return nil, "multi not supported in sample (num="..tostring(num)..")" end
    -- Event_Type(1) / AddrType(1) / Addr(6)
    idx = idx + 1 -- skip event_type
    local at = u8(hci_bytes, idx); idx = idx + 1
    local b1,b2,b3,b4,b5,b6 = hci_bytes:byte(idx, idx+5); idx = idx + 6
    local addr = format_addr_le6(b1,b2,b3,b4,b5,b6, true)
    local adlen = u8(hci_bytes, idx); idx = idx + 1
    local ad = hci_bytes:sub(idx, idx+adlen-1); idx = idx + adlen
    local rssi_b = u8(hci_bytes, idx) or 0x80
    local rssi = (rssi_b >= 0x80) and (rssi_b - 256) or rssi_b
    return {addr=addr, addr_type=at, ad=ad, rssi=rssi}
  elseif subevt == 0x0D then
    -- LE Extended Advertising Report
    local idx = 5
    local num = u8(hci_bytes, idx); idx = idx + 1
    if num ~= 1 then return nil, "multi not supported in sample (num="..tostring(num)..")" end
    local event_type_lo, event_type_hi = u8(hci_bytes, idx), u8(hci_bytes, idx+1); idx = idx + 2
    local at = u8(hci_bytes, idx); idx = idx + 1
    local b1,b2,b3,b4,b5,b6 = hci_bytes:byte(idx, idx+5); idx = idx + 6
    local addr = format_addr_le6(b1,b2,b3,b4,b5,b6, true)
    -- PrimaryPHY(1) / SecondaryPHY(1) / SID(1) / TxPower(1) / RSSI(1)
    idx = idx + 3
    local txp = u8(hci_bytes, idx); idx = idx + 1
    local rssi_b = u8(hci_bytes, idx); idx = idx + 1
    local rssi = (rssi_b >= 0x80) and (rssi_b - 256) or rssi_b
    -- PeriodicInterval(2) / DirectAddrType(1) / DirectAddr(6)
    idx = idx + 2 + 1 + 6
    local adlen = u8(hci_bytes, idx); idx = idx + 1
    local ad = hci_bytes:sub(idx, idx+adlen-1)
    return {addr=addr, addr_type=at, ad=ad, rssi=rssi}
  else
    return nil, string.format("unsupported subevent 0x%02X", subevt)
  end
end

-- 参照用にベスト記録へアクセスする関数（任意）
local function get_best(major, minor)
  return best[tostring(major) .. ":" .. tostring(minor)]
end

-- ====== ベストRSSI管理 ======
local best = {}

function store_ibeacon(hci, rep, ibeacon)

  local key = tostring(ibeacon.major) .. ":" .. tostring(ibeacon.minor)
  local cur = best[key]
  if (not cur) or (rep.rssi > cur.rssi) then
    best[key] = {
      rssi = rep.rssi,
      hci = hci,
    }
    return best[key]
  end
  return nil, "weaker than existing"
end

function on_upstream(module, func, data)
  if module ~= 11 or func ~= 44 then
    return 1;
  end

  local rep, err = parse_one_report(data)
  if not rep then
    return 1;
  end

  -- os.log("advertisement: "..rep.rssi.."dBi");
  local ibeacon = parse_ibeacon_from_ad(rep.ad)
  if ibeacon then
    local best = store_ibeacon(data, rep, ibeacon);
    if best then
      os.log("strongest ibeacon: "..rep.rssi.."dBi");
      return 0;
    else
      os.log("weak "..rep.rssi.."dBi");
      return 1;
    end
    return 0;
  else
    return 0;
  end
end

function on_event(event)
  if event == "power_on" then
    os.log(" - Lua PowerOn");
  end
end

last_tick = 0;
interval = 10 * 1000;

function on_online_loop()
  local tick = os.getTick();
  if tick < last_tick then
    last_tick = 0;
  end
  if tick - last_tick < interval then
    return;
  end
  last_tick = tick;
  for k, v in pairs(best) do
    os.log("best: "..k.." "..v.rssi);
    cloud.upstreamEnqueue(11, 44, v.hci)
  end
  
  -- bestテーブルを空にする
  best = {};
end
