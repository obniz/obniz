import { MESH_js } from '.';
export declare class MESH_js_AC extends MESH_js {
    /**
     * MessageTypeID
     * command header
     */
    private readonly MessageTypeID;
    private accele;
    private face;
    private readonly DATA_LENGTH;
    onTapped: ((accele: MESH_js_AC['accele']) => void) | null;
    onShaked: ((accele: MESH_js_AC['accele']) => void) | null;
    onFlipped: ((accele: MESH_js_AC['accele']) => void) | null;
    onDirection: ((face: number, accele: MESH_js_AC['accele']) => void) | null;
    notify(data: number[]): void;
    get getAccele(): MESH_js_AC['accele'];
    get getFace(): number;
    /**
     * setMode
     *
     * @param type
     * @returns
     */
    private updateAccele;
    private complemnt;
}
