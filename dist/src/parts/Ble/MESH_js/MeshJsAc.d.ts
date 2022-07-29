import { MeshJs } from './MeshJs';
export declare class MeshJsAc extends MeshJs {
    onTapped: ((acceleX: number, acceleY: number, acceleZ: number) => void) | null;
    onShaked: ((acceleX: number, acceleY: number, acceleZ: number) => void) | null;
    onFlipped: ((acceleX: number, acceleY: number, acceleZ: number) => void) | null;
    onOrientation: ((face: number, acceleX: number, acceleY: number, acceleZ: number) => void) | null;
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
