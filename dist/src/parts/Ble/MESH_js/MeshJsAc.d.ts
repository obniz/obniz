import { MeshJs } from './MeshJs';
export declare class MeshJsAc extends MeshJs {
    onTapped: ((accele: MeshJsAc['accele']) => void) | null;
    onShaked: ((accele: MeshJsAc['accele']) => void) | null;
    onFlipped: ((accele: MeshJsAc['accele']) => void) | null;
    onOrientationChanged: ((face: number, accele: MeshJsAc['accele']) => void) | null;
    protected accele: {
        x: number;
        y: number;
        z: number;
    };
    private readonly MESSAGE_TYPE_ID_;
    private readonly DATA_LENGTH_;
    private readonly TAP_EVENT_ID_;
    private readonly SHAKE_EVENT_ID_;
    private readonly FLIP_EVENT_ID_;
    private readonly ORIENTATION_EVENT_ID_;
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    private complemnt_;
}
