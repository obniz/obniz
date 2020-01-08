// Type definitions for WSCommandDirective
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

import WSCommand from "./WSCommand";

export default class WSCommandDirective extends WSCommand {
  public module: number;

  public parseFromJson(json: object): void;
}
