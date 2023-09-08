import { HandlerResponse, PromptHandler } from '../../../builder';
import { UserProductReviewAddSuccessNode } from './nodes';

export class UserProductReviewAddHandler extends PromptHandler<{ id: number }> {
    async handle(): Promise<HandlerResponse<any>> {
        const user = await this.provider.getUser(this.ctx);

        await this.provider.reviewRepository.save({
            userId: user.id,
            productId: this.params.id,
            text: this.prompt
        });

        return {
            nextNode: UserProductReviewAddSuccessNode.withParams({
                id: this.params.id
            })
        };
    }
}
