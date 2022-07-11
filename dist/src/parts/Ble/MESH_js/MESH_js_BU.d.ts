import { MESH_js } from '.';
export declare class MESH_js_BU extends MESH_js {
    onSinglePressed: (() => void) | null;
    onLongPressed: (() => void) | null;
    onDoublePressed: (() => void) | null;
    private readonly DATA_LENGTH;
    private readonly MessageTypeID;
    private readonly EventTypeID;
    private readonly TYPE;
    notify(data: number[]): void;
}
