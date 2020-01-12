declare class BleAttributeAbstract {
    uuid: any;
    parent: any;
    children: any;
    isRemote: any;
    discoverdOnRemote: any;
    data: any;
    emitter: any;
    constructor(params: any);
    setFunctions(): void;
    readonly childrenClass: any;
    readonly childrenName: any;
    readonly parentName: any;
    addChild(child: any): any;
    getChild(uuid: any): any;
    toJSON(): any;
    /**
     * WS COMMANDS
     */
    read(): void;
    write(val: any, needResponse?: any): void;
    writeNumber(val: any, needResponse?: any): void;
    writeText(str: any, needResponse?: any): void;
    readWait(): Promise<{}>;
    writeWait(data: any, needResponse: any): Promise<{}>;
    writeTextWait(data: any): Promise<{}>;
    writeNumberWait(data: any): Promise<{}>;
    readFromRemoteWait(): Promise<{}>;
    writeFromRemoteWait(): Promise<{}>;
    /**
     * CALLBACKS
     */
    onwrite(result: any): void;
    onread(data: any): void;
    onwritefromremote(address: any, data: any): void;
    onreadfromremote(address: any): void;
    onerror(err: any): void;
    notifyFromServer(notifyName: any, params: any): void;
}
export default BleAttributeAbstract;
