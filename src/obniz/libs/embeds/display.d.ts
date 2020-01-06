import {CorrectionType, DisplayCommon} from "./display_common";

export interface Display extends DisplayCommon {
  qr(data: string, correction?: CorrectionType): void;
}
