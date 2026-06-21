
import Obniz from "../../../../"
if (typeof process.env.OBNIZ_ID !== "string") {
  throw new Error(`Please set export OBNIZ_ID=your_obniz_id`)
}
const obniz = new Obniz(process.env.OBNIZ_ID, { local_connect: false });

console.log("connecting");
obniz.onconnect = async () => {
  console.log("connected");

  // Run Lua on the device and wait for whatever it returns.
  const result = await obniz.plugin!.callWait(`return "hello from lua"`);
  console.log("result:", result); // "hello from lua"

  // Lua can compute and return a value back to JS.
  const sum = await obniz.plugin!.callWait(`
    local x = 0
    for i = 1, 10 do x = x + i end
    return tostring(x)
  `);
  console.log("sum:", sum); // "55"

  // Errors raised in Lua reject the promise.
  try {
    await obniz.plugin!.callWait(`MUST FAILED`);
  } catch (e) {
    console.log("lua error:", (e as Error).message);
  }
};
