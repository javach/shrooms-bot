import { WithContext } from '../common';
import { Keyboard } from '../keyboard';
import { PromptHandler } from '../handlers';
import { Commands } from '../../text';

export class MenuNode<
    TParams = Record<string, never>
> extends WithContext<TParams> {
    promptHandler: typeof PromptHandler<Partial<TParams>>;
    static entryCommand: Commands = null;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        throw new Error();
    }
}
