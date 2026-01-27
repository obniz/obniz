
local function tohex(data)
  local hex = {}
  for i = 1, #data do
    hex[#hex+1] = string.format("%02x", data:byte(i))
  end
  return table.concat(hex, "")
end

function onFind(peripheral)
  os.log("found\n addr: " .. tohex(peripheral.address) .. "\n rssi:" .. tostring(peripheral.rssi) .. "\n data:" .. tohex(peripheral.advData));
end

local ret = ble.on();
os.log("ble on ret=" .. tostring(ret));

ret = ble.scanStart(onFind, {
  active=false,
  interval=16,
  window=16,
  phy1m=true,
  phyCoded=true,
  duplicate=true
});
os.log("scan started ret=" .. tostring(ret));

-- ble.scanStop();