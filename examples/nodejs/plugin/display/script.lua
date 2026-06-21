-- Display example: reveal text one character at a time (typewriter / ChatGPT style).
--
-- display.print(str) appends at the current cursor (typewrite), so printing one
-- character per tick makes it appear gradually, character by character.
--
-- display.print("Hello") -- append a string on the display
-- display.clear()        -- clear the screen
-- display.raw({...})     -- draw a raw vertical-byte framebuffer (each value 0-255)
--
-- On products without a display this is a no-op.

local messages = {
  "Hello from obniz",
  "Lua is running on the device.",
  "Bye!",
}

local msg_index = 1
local char_index = 0
local tick = 0
local interval = 120 -- ms per character

os.log(" - Lua PowerOn");
display.clear();

function on_offline_loop()
  loop()
end

function on_online_loop()
  loop()
end

function loop()
  if tick + interval < os.getTick() then
    tick = os.getTick()

    local msg = messages[msg_index]
    if char_index < #msg then
      -- start each cycle with a clean screen
      if char_index == 0 and msg_index == 1 then
        display.clear();
      end
      -- append the next single character (typewriter effect)
      char_index = char_index + 1
      display.print(msg:sub(char_index, char_index));
    else
      -- finished this message: move to the next one on a new line
      char_index = 0
      msg_index = msg_index + 1
      if msg_index > #messages then
        msg_index = 1
      end
    end
  end
end
