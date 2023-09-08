import { WithParams } from './with-params';
import { Context } from 'telegraf';
import { ProviderService } from '../../services';

export class WithContext<
    TParams = Record<string, never>
> extends WithParams<TParams> {
    protected readonly ctx: Context;
    protected readonly provider: ProviderService;

    constructor(provider: ProviderService, ctx: Context, params?: TParams) {
        super(params);
        this.provider = provider;
        this.ctx = ctx;
    }
}
