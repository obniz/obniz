
local function tohex(data)
  local hex = {}
  for i = 1, #data do
    hex[#hex+1] = string.format("%02x", data:byte(i))
  end
  return table.concat(hex, "")
end

function onFind(peripheral)
  local found = "found\n addr: " .. tohex(peripheral.address) .. "\n rssi:" .. tostring(peripheral.rssi) .. "\n data:" .. tohex(peripheral.advData) .. "\n scanResp:" .. tostring(peripheral.isScanResp) .. "\n"
  os.log(found);
  cloud.pluginSend(found);
end

local ret = ble.on();
os.log("ble on ret=" .. tostring(ret));

ret = ble.scanStart(onFind, {
  active=true,
  interval=16,
  window=16,
  phy1m=true,
  phyCoded=true,
  duplicate=true
});
os.log("scan started ret=" .. tostring(ret));

-- ble.scanStop();