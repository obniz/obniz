const Obniz = require("./index")

var obniz = new Obniz("60229520");


obniz.onconnect = async function () {
    let device = obniz.wired("Puls08M5stickcS",{tx:26,rx:0});
    device.onbpmupdate = (data)=>{
        console.log(data);
    }

    // device.onrawupdate = (data)=>{
    //     cosnole.log(data);
    // }
};