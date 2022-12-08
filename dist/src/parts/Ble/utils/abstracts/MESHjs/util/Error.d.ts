export declare class MESHJsError extends Error {
    code: number;
    constructor(code: number, e?: string);
}
export declare class MESHJsBlockVersionError extends MESHJsError {
    major: number;
    constructor(major: number, minor: number, release: number);
}
export declare class MESHJsOutOfRangeError extends MESHJsError {
    property: string;
    constructor(property: string, min: number, max: number);
}
export declare class MESHJsInvalidValueError extends MESHJsError {
    property: string;
    constructor(property: string);
}
export declare class MESHJsTimeOutError extends MESHJsError {
    property: string;
    constructor(property: string);
}
