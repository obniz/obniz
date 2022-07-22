export declare class MeshJsError extends Error {
    code: number;
    constructor(code: number, e?: string);
}
export declare class MeshJsOutOfRangeError extends MeshJsError {
    property: string;
    constructor(property: string, min?: number, max?: number);
}
export declare class MeshJsInvalidValueError extends MeshJsError {
    property: string;
    constructor(property: string);
}
