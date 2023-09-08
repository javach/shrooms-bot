import { MenuNode } from '../nodes';
import { WithContext } from '../common';

export type HandlerResponse<TParams> = {
    nextNode: {
        type: typeof MenuNode<TParams>;
        params: TParams;
    };
    answerMessage?: string;
};

export class Handler<
    TParams = Record<string, never>
> extends WithContext<TParams> {
    async handle(): Promise<HandlerResponse<any>> {
        throw new Error();
    }
}

export class MoveHandler<TNodeParams> extends Handler<
    TNodeParams extends Record<string, never>
        ? { nodeId: string }
        : { nodeId: string } & TNodeParams
> {
    async handle(): Promise<HandlerResponse<any>> {
        const { nodeId, ...params } = this.params;
        const node = this.provider.getNode(nodeId);
        return {
            nextNode: node.withParams(params)
        };
    }
}
