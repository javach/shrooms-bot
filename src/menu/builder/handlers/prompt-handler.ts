import { Handler } from './handler';
import { ProviderService } from '../../services';
import { Context } from 'telegraf';

export class PromptHandler<TParams = null> extends Handler<TParams> {
    protected prompt: string;

    constructor(
        provider: ProviderService,
        ctx: Context,
        params: TParams,
        prompt?: string
    ) {
        super(provider, ctx, params);
        this.prompt = prompt;
    }
}
