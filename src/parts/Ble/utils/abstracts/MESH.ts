/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizPartsBle,
  ObnizPartsBleConnectable,
} from '../../../../obniz/ObnizPartsBleAbstract';

export abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
  // 認証とか共通項目はこちらのクラスで

  async authWait() {
    const char = this.getChar('uuid1', 'uuid2');
    await char.writeWait([0, 0, 0, 0]);
  }
}
