export = BleRemoteAttributeAbstract;
declare const BleRemoteAttributeAbstract_base: any;
declare class BleRemoteAttributeAbstract extends BleRemoteAttributeAbstract_base {
    [x: string]: any;
    constructor(params: any);
    isRemote: boolean;
    discoverdOnRemote: boolean;
    get wsChildUuidName(): string | null;
    discoverChildren(): void;
    discoverChildrenWait(): Promise<any>;
    /**
     * CALLBACKS
     */
    ondiscover(): void;
    ondiscoverfinished(): void;
    notifyFromServer(notifyName: any, params: any): void;
}
