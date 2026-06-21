

io.drive(0, "5v");
io.output(0, true);

io.drive(1, "3v");
io.output(1, true);

io.pull(2, "5v");
io.drive(2, "open-drain");
io.output(2, true);