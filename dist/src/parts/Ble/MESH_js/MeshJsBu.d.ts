import { MeshJs } from './MeshJs';
export declare class MeshJsBu extends MeshJs {
    onSinglePressed: (() => void) | null;
    onLongPressed: (() => void) | null;
    onDoublePressed: (() => void) | null;
    private readonly DataLength;
    private readonly MessageTypeID;
    private readonly EventTypeID;
    private readonly Type;
    notify(data: number[]): void;
}
