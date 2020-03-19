
stick.onconnect = async () => {
  console.log("obniz connected");
  await stick.ble.initWait();
  // stick.debugprint = true;

  let isFirst = true;
  const SEEK = Obniz.getPartsClass("RS_Seek3");
  stick.ble.scan.start(null, { duplicate: true, duration: null });
  stick.ble.scan.onfind = async (p: BleRemotePeripheral) => {
    if (SEEK.isDevice(p) && isFirst) {
      isFirst = false;
      console.log("find");
      const device = new SEEK(p);
      await device.connectWait();
      console.log("connected");
      device.onchange = (pressed: boolean) => {
        console.log("pressed : " + pressed);
      };
      console.log(await device.getTempHumidWait());
    }
  };
};
