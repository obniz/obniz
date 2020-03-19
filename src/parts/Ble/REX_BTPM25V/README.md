
stick.onconnect = async () => {
  console.log("obniz connected");
  await stick.ble.initWait();
  // stick.debugprint = true;

  let isFirst = true;
  const BTPM25: typeof REX_BTPM25V = Obniz.getPartsClass("REX_BTPM25V" as any) as any;
  stick.ble.scan.start(null, { duplicate: true, duration: null });
  stick.ble.scan.onfind = async (p: BleRemotePeripheral) => {
    if (BTPM25.isDevice(p) && isFirst) {
      isFirst = false;
      console.log("find");
      const device = new BTPM25(p);
      await device.connectWait();
      console.log("connected");
      device.onbuttonpressed = (pressed) => {
        console.log("pressed " + pressed);
      };

      while (1) {
        const data = await device.measureOneShotExtWait();
        console.log(data);
      }
    }
  };
};
