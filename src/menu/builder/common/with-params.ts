import { Constructor } from '../../../utils';

export class WithParams<TParams = Record<string, never>> {
    static id: string;
    protected readonly params: TParams;

    static attachId<T extends WithParams<P>, P>(
        this: Constructor<T> & { id: string },
        id: string
    ) {
        this.id = id;
    }

    protected constructor(params: TParams) {
        this.params = params;
    }

    static withParams<T extends WithParams<P>, P>(
        this: Constructor<T>,
        params: T extends WithParams<infer B> ? B : never
    ): {
        type: typeof this;
        params: T extends WithParams<infer B> ? B : never;
    } {
        return { type: this, params };
    }

    static withoutParams<
        T extends WithParams<P>,
        P extends Record<string, never>
    >(
        this: Constructor<T>
    ): {
        type: typeof this;
        params: Record<string, never>;
    } {
        return { type: this, params: {} };
    }

    static encodeParams(params: any): string {
        return JSON.stringify(params);
    }

    static decodeParams<P = any>(params: string): P {
        return JSON.parse(params);
    }
}
