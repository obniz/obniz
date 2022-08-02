export declare class MeshJsError extends Error {
    code: number;
    constructor(code: number, e?: string);
}
export declare class MeshBlockVersionError extends MeshJsError {
    major: number;
    constructor(major: number, minor: number, release: number);
}
export declare class MeshJsOutOfRangeError extends MeshJsError {
    property: string;
    constructor(property: string, min: number, max: number);
}
export declare class MeshJsInvalidValueError extends MeshJsError {
    property: string;
    constructor(property: string);
}
export declare class MeshJsTimeOutError extends MeshJsError {
    property: string;
    constructor(property: string);
}
