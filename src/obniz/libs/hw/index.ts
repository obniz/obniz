/**
 * @packageDocumentation
 * @ignore
 */

export default class HW {
  public static getDefinitionFor(hw: any) {
    if (hw === "obnizb1") {
      return require("./obnizb1.json");
    } else if (hw === "obnizb2") {
      return require("./obnizb2.json");
    } else if (hw === "esp32w") {
      return require("./esp32w.json");
    } else if (hw === "esp32p") {
      return require("./esp32p.json");
    } else if (hw === "m5stickc") {
      return require("./m5stickc.json");
    } else if (hw === "m5stack_basic") {
      return require("./m5stack_basic.json");
    } else if (hw === "encored") {
      return require("./encored.json");
    } else if (hw === "encored_lte") {
      return require("./encored_lte.json");
    } else {
      // default
      return require("./esp32w.json");
    }
    return undefined;
  }
}
