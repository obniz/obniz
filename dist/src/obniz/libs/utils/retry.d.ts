export declare const retry: <T>(times: number, f: () => Promise<T>, onFail?: ((err: any) => Promise<void>) | undefined) => Promise<T>;
