-- PWM example: breathing LED on a logical obniz IO.
--
-- pwm.start(io)         -- start PWM on a logical obniz IO (returns 0 on success)
-- pwm.freq(io, hz)      -- set frequency in Hz
-- pwm.duty(io, percent) -- set duty cycle (0-100%)
-- pwm.stop(io)          -- stop PWM and release the IO

local gnd_io_num = 2
local io_num = 1
local duty = 0
local step = 5
local tick = 0


io.drive(gnd_io_num, "5v");
io.output(gnd_io_num, false);
io.drive(io_num, "5v");
os.log(" - Lua PowerOn");
pwm.stop(io_num); 
pwm.start(io_num);
pwm.freq(io_num, 1000);   -- 1kHz
pwm.duty(io_num, duty);

function on_offline_loop()
  loop()
end

function on_online_loop()
  loop()
end

function loop()
  -- update the duty every 50ms to fade the LED up and down
  if tick + 50 < os.getTick() then
    tick = os.getTick()
    duty = duty + step
    if duty >= 100 then
      duty = 100
      step = -step
    elseif duty <= 0 then
      duty = 0
      step = -step
    end
    pwm.duty(io_num, duty)
  end
end
