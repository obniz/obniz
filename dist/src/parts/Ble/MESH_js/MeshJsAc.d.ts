import { MeshJs } from './MeshJs';
export declare class MeshJsAc extends MeshJs {
    onTapped: ((accele: MeshJsAc['accele_']) => void) | null;
    onShaked: ((accele: MeshJsAc['accele_']) => void) | null;
    onFlipped: ((accele: MeshJsAc['accele_']) => void) | null;
    onDirection: ((face: number, accele: MeshJsAc['accele_']) => void) | null;
    private readonly MESSAGE_TYPE_ID_;
    private readonly DATA_LENGTH_;
    private readonly TAP_EVENT_ID_;
    private readonly SHAKE_EVENT_ID_;
    private readonly FLIP_EVENT_ID_;
    private readonly DIRECTION_EVENT_ID_;
    private accele_;
    private face_;
    get getAccele(): MeshJsAc['accele_'];
    get getFace(): number;
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    private updateAccele_;
    private complemnt_;
}
