
stick.onconnect = async () => {
  console.log("connected");
  await stick.ble.initWait();
  stick.debugprint = true;

  const MINEW_S1 = Obniz.getPartsClass("MINEW_S1");
  stick.ble.scan.start(null, { duplicate: true, duration: null });
  stick.ble.scan.onfind = (p: BleRemotePeripheral) => {
    if (MINEW_S1.isDevice(p)) {
      const data = MINEW_S1.getHTData(p) || MINEW_S1.getInfoData(p);
      console.log(data);
    }
  };
};
