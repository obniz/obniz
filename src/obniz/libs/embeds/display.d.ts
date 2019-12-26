import { DisplayCommon, CorrectionType } from './display_common';

export interface Display extends DisplayCommon {
  qr(data: string, correction?: CorrectionType): void;
}
