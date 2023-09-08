export type Constructor<TClass, TParams extends Array<any> = any[]> = new (
    ...args: TParams
) => TClass;
