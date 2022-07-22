export declare class MESH_js_Error extends Error {
    code: number;
    constructor(code: number, e?: string);
}
export declare class MESHOutOfRangeError extends MESH_js_Error {
    property: string;
    constructor(property: string, min?: number, max?: number);
}
export declare class MESHInvalidValue extends MESH_js_Error {
    property: string;
    constructor(property: string);
}
