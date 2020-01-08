export = BleAttributeAbstract;
declare class BleAttributeAbstract {
    constructor(params: any);
    uuid: any;
    parent: any;
    children: any[];
    isRemote: boolean;
    discoverdOnRemote: boolean;
    data: any;
    emitter: import("eventemitter3")<string | symbol>;
    setFunctions(): void;
    get childrenClass(): ObjectConstructor;
    get childrenName(): null;
    get parentName(): null;
    addChild(child: any): any;
    getChild(uuid: any): any;
    toJSON(): {
        uuid: any;
    };
    /**
     * WS COMMANDS
     */
    read(): void;
    write(): void;
    writeNumber(val: any, needResponse: any): void;
    writeText(str: any, needResponse: any): void;
    readWait(): Promise<any>;
    writeWait(data: any, needResponse: any): Promise<any>;
    writeTextWait(data: any): Promise<any>;
    writeNumberWait(data: any): Promise<any>;
    readFromRemoteWait(): Promise<any>;
    writeFromRemoteWait(): Promise<any>;
    /**
     * CALLBACKS
     */
    onwrite(): void;
    onread(): void;
    onwritefromremote(): void;
    onreadfromremote(): void;
    onerror(err: any): void;
    notifyFromServer(notifyName: any, params: any): void;
}
