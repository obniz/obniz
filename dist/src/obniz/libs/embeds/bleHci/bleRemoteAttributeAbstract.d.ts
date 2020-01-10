import BleAttributeAbstract from "./bleAttributeAbstract";
declare class BleRemoteAttributeAbstract extends BleAttributeAbstract {
    isRemote: any;
    discoverdOnRemote: any;
    childrenName: any;
    emitter: any;
    children: any;
    getChild: any;
    addChild: any;
    constructor(params: any);
    readonly wsChildUuidName: string | null;
    discoverChildren(): void;
    discoverChildrenWait(): Promise<{}>;
    /**
     * CALLBACKS
     */
    ondiscover(child: any): void;
    ondiscoverfinished(children: any): void;
    notifyFromServer(notifyName: any, params: any): void;
}
export default BleRemoteAttributeAbstract;
