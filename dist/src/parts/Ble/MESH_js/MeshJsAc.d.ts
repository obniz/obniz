import { MeshJs } from './MeshJs';
export declare class MeshJsAc extends MeshJs {
    /**
     * MessageTypeID
     * command header
     */
    private readonly MessageTypeID;
    private accele;
    private face;
    private readonly DataLength;
    onTapped: ((accele: MeshJsAc['accele']) => void) | null;
    onShaked: ((accele: MeshJsAc['accele']) => void) | null;
    onFlipped: ((accele: MeshJsAc['accele']) => void) | null;
    onDirection: ((face: number, accele: MeshJsAc['accele']) => void) | null;
    notify(data: number[]): void;
    get getAccele(): MeshJsAc['accele'];
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
