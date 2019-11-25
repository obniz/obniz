const Obniz = require("./index")

// var obniz = new Obniz("60229520");
var obniz = new Obniz("66324609");


obniz.onconnect = async function () {
    let device = obniz.wired("MPU6886",{scl:22, sda:21});


    let whoami = await device.whoamiWait();
    while(1){
        let data = await device.getAllDataWait();
        console.log(data);
        await obniz.wait(1000);
    }

};