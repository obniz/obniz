"use strict";
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
class MESH extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    // 認証とか共通項目はこちらのクラスで
    async authWait() {
        const char = this.getChar('uuid1', 'uuid2');
        await char.writeWait([0, 0, 0, 0]);
    }
}
exports.MESH = MESH;
