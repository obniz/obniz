
import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  // Called when Lua runs cloud.transactionWait(data) on the device.
  // Whatever this handler returns is passed back to the waiting Lua coroutine
  // (success = true). Throwing reports success = false to Lua.
  obniz.plugin!.onCloudTransaction = async (data, str) => {
    console.log("lua asked cloud:", str);
    // e.g. call an external API here and return its response.
    return `echo:${str}`;
  };

  // Kick off a Lua coroutine that asks the cloud and uses the response.
  // (callWait runs the script inside a coroutine, so transactionWait can yield.)
  const result = await obniz.plugin!.callWait(`
    os.log("start");
    -- cloud.transactionWait(data [, callback] [, timeout_ms])
    -- timeout_ms defaults to 30000ms when omitted. Here we specify 5000ms.
    local success, result = cloud.transactionWait("ping", 5000)
    if success then
      return result
    else
      return "transaction failed"
    end
  `);
  console.log("lua got back:", result); // "echo:ping"
};
