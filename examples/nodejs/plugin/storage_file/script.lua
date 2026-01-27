

-- open
storage.fileOpen("text.txt")

-- Write
storage.fileWrite("ABC");
length = storage.fileGetSize();
os.log("File size: " .. length);
data = storage.fileRead(0, length);
os.log(data);

-- Append
storage.fileAppend("abcdefg");
storage.fileAppend("HIJKLKLMN");
length = storage.fileGetSize();
os.log("File size: " .. length);
data = storage.fileRead(0, length);
os.log(data);

-- Ranged Read
data = storage.fileRead(3, 7);
os.log(data);

-- Overwrite
storage.fileWrite("ZYZ");
length = storage.fileGetSize();
os.log("File size: " .. length);
data = storage.fileRead(0, length);
os.log(data);

-- close
storage.fileClose();