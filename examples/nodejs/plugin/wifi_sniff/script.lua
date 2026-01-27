


local function mac_to_hex(mac)
  local bytes = {string.byte(mac, 1, 6)}
  return string.format("%02X%02X%02X%02X%02X%02X",
    bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6])
end

function callback(da_addr, sa_addr, bssid_addr, channel, rssi)
  local da = mac_to_hex(da_addr)
  local sa = mac_to_hex(sa_addr)
  local bssid = mac_to_hex(bssid_addr)
  os.log(string.format(
    "DA: %s, SA: %s, BSSID: %s, Channel: %d, RSSI: %d",
    da, sa, bssid, channel, rssi
  ))
end

function init()
  wifi.sniffStart(callback);
  wifi.sniffSetChannel(2);
  os.log("WiFi Sniffing started.")
end


init();
