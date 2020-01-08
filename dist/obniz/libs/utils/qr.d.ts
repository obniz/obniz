declare const _qrcode: {
    (_typeNumber: number, errorCorrectionLevelStr: import("../embeds/display_common").CorrectionType): any;
    stringToBytesFuncs: any;
    stringToBytes: any;
    /**
     * @param unicodeData base64 string of byte array.
     * [16bit Unicode],[16bit Bytes], ...
     * @param numChars
     */
    createStringToBytes(unicodeData: any, numChars: any): (s: any) => any[];
};
