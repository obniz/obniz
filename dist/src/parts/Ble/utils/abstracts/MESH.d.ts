import { ObnizPartsBleConnectable } from '../../../../obniz/ObnizPartsBleAbstract';
export declare abstract class MESH<S> extends ObnizPartsBleConnectable<null, S> {
    authWait(): Promise<void>;
}
