-- HTTP example using the `net` module.
--
-- net.httpGet(url)                       -> status, body, headers | nil, err
-- net.httpPost(url, body[, contentType]) -> status, body, headers | nil, err
-- net.httpRequest({url=, method=, headers=, body=, timeout=})
--                                        -> status, body, headers | nil, err
--
-- On failure the first return value is nil and the second is an error string.

local done = false

function on_online_loop()
  -- Run once after the device is online (network is ready).
  if done then return end
  done = true

  -- 1) Simple GET
  os.log("HTTP GET ...");
  local status, body, headers = net.httpGet("http://example.com/");
  if status then
    os.log("GET status: " .. status);
    os.log("GET body length: " .. #body);
    os.log("GET body head: " .. body:sub(1, 80));
  else
    os.log("GET error: " .. (body or "?")); -- body holds the error string here
  end

  -- 2) POST with a content type
  os.log("HTTP POST ...");
  local s2, b2 = net.httpPost("http://httpbin.org/post", "hello=world",
                              "application/x-www-form-urlencoded");
  if s2 then
    os.log("POST status: " .. s2);
    os.log("POST body head: " .. b2:sub(1, 120));
  else
    os.log("POST error: " .. (b2 or "?"));
  end

  -- 3) Full control with custom method / headers / timeout
  os.log("HTTP request (custom headers) ...");
  local s3, b3, h3 = net.httpRequest({
    url = "http://httpbin.org/headers",
    method = "GET",
    headers = { ["X-Obniz"] = "lua", ["Accept"] = "application/json" },
    timeout = 10000,
  });
  if s3 then
    os.log("request status: " .. s3);
    os.log("request body head: " .. b3:sub(1, 120));
  else
    os.log("request error: " .. (b3 or "?"));
  end

  os.log("HTTP example done");
end

function on_offline_loop()
  -- Network is required, so nothing to do while offline.
end
