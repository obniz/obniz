import { MeshJs } from './MeshJs';
export declare class MeshJsBu extends MeshJs {
    onSinglePressedNotify: (() => void) | null;
    onLongPressedNotify: (() => void) | null;
    onDoublePressedNotify: (() => void) | null;
    private readonly DATA_LENGTH_;
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private readonly TYPE_;
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
}
