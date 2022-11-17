


```typescript

obniz.onconnect = async () => {
  console.log("online");
  await obniz.ble.initWait();

  await obniz.ble.scan.startWait(null, { duration: null });
  // var peripheral = await obniz.ble.scan.startOneWait({ localName: "btwattch2_5082" });


  const GX_3R_Pro = Obniz.getPartsClass("GX_3R_Pro");
  obniz.ble.scan.onfind = async (peripheral) => {
    console.log(`peripheral ${peripheral.address} ${peripheral.localName}`);
    if (GX_3R_Pro.isDevice(peripheral)) {
      console.log("find");
      const gx = new GX_3R_Pro(peripheral);
      await gx.connectWait();
      console.log("connected");

      while(1){
        const results = await gx.getDataWait();
        console.log(results);
      }
    }
  };
};

```