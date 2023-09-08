import { Handler, MoveHandler } from '../handlers';
import { InlineKeyboardButton } from 'telegraf/types';
import { WithParams } from '../common';
import { MenuNode } from '../nodes';

export class KeyboardButton<TParams> {
    static separator = '$';
    private readonly text: string;
    private readonly handler: typeof Handler<TParams>;
    private readonly params: TParams;

    constructor(options: {
        text: string;
        handler: { type: typeof Handler<TParams>; params?: TParams };
    }) {
        this.text = options.text;
        this.handler = options.handler.type;
        this.params = options.handler.params || ({} as TParams);
    }

    encode(): InlineKeyboardButton.CallbackButton {
        return {
            text: this.text,
            callback_data: `${this.handler.id}${
                KeyboardButton.separator
            }${WithParams.encodeParams(this.params)}`
        };
    }

    static decodeCallbackData(callbackData: string) {
        const [handlerId, ...paramsJson] = callbackData.split(
            KeyboardButton.separator
        );
        return {
            handlerId,
            params: WithParams.decodeParams(paramsJson.join(''))
        };
    }
}

export class MoveButton<TParams> extends KeyboardButton<TParams> {
    constructor(options: {
        text: string;
        node: {
            type: typeof MenuNode<TParams>;
            params?: TParams;
        };
    }) {
        super({
            text: options.text,
            handler: MoveHandler.withParams({
                nodeId: options.node.type.id,
                ...(options.node.params || {})
            }) as any
        });
    }
}
