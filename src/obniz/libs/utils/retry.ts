export const retry = async <T>(
  times: number,
  f: () => Promise<T>,
  onFail?: (err: any) => Promise<void>
) => {
  let error = new Error(`Failed ${times} times`); // will be not use
  for (let i = 0; i < times; i++) {
    try {
      return await f();
    } catch (e) {
      error = e as Error;
      if (onFail) {
        await onFail(error);
      }
    }
  }

  throw error;
};
