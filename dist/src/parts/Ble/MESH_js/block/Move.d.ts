import { Base } from './Base';
export declare class Move extends Base {
    onTapped: ((accele: Move['accele']) => void) | null;
    onShaked: ((accele: Move['accele']) => void) | null;
    onFlipped: ((accele: Move['accele']) => void) | null;
    onOrientationChanged: ((face: number, accele: Move['accele']) => void) | null;
    protected accele: {
        x: number;
        y: number;
        z: number;
    };
    private readonly MESSAGE_TYPE_INDEX_;
    private readonly TYPE_INDEX_;
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
}
