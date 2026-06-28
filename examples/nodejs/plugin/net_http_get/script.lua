-- HTTP GET example using the `net` module: fetch a public website from the
-- device. No local server is needed - this talks to the public internet.
--
-- net.http.get(url) -> status, body, headers | nil, err
--
-- Both http:// and https:// URLs are supported (https uses port 443).
-- NOTE: redirects are NOT followed, so the status may be 301/302 if a site
--       redirects. Use the final URL directly (e.g. the https:// one).

local URLS = {
  "http://example.com/",
}

local done = false

function on_online_loop()
  -- Run once after the device is online (network is ready).
  if done then return end
  done = true

  for _, url in ipairs(URLS) do
    os.log("GET " .. url);
    local status, body, headers = net.http.get(url);
    if status then
      os.log("  status: " .. status);
      os.log("  body length: " .. #body);
      os.log("  body head: " .. body:sub(1, 80));
    else
      os.log("  error: " .. (body or "?")); -- body holds the error string here
    end
  end

  os.log("HTTP GET example done");
end

function on_offline_loop()
  -- Network is required, so nothing to do while offline.
end
