function table_to_string(tbl, indent)
  indent = indent or 0
  local s = string.rep(" ", indent) .. "{\n"
  for k, v in pairs(tbl) do
    s = s .. string.rep(" ", indent + 2) .. tostring(k) .. " = "
    if type(v) == "table" then
      s = s .. table_to_string(v, indent + 2)
    else
      s = s .. tostring(v)
    end
    s = s .. ",\n"
  end
  s = s .. string.rep(" ", indent) .. "}"
  return s
end

-- load
data = storage.kvsLoad();
if data == nil then
  os.log("load result: nil");
else
  os.log("load result: ");
  os.log(table_to_string(data));
end

-- new data
obj = {
  a=1,
  b="hello",
  bool=true,
  c={ x=10, y=20, z={ foo="bar" } }
}

os.log("new data");
os.log(table_to_string(obj));

-- save
result = storage.kvsSave(obj)
os.log("save result: " .. tostring(result));