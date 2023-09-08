import { Handler, HandlerResponse, PromptHandler } from '../../../builder';
import { MenuError } from '../../../types';
import { Text } from '../../../text';
import { AdminCategoryListNode, AdminCategoryNode } from './nodes';
import { Category } from '../../../../entities';

export class AdminCategoryEditNameHandler extends PromptHandler<{
    id: number;
}> {
    async handle(): Promise<HandlerResponse<any>> {
        const maxLength = 32;
        if (this.prompt.length < 0 || this.prompt.length > maxLength) {
            throw new MenuError(
                Text.Admin.Callback.promptLengthError(maxLength)
            );
        }

        await this.provider.categoryRepository.save({
            id: this.params.id,
            name: this.prompt
        });

        return {
            nextNode: AdminCategoryNode.withParams({ id: this.params.id })
        };
    }
}

export class AdminCategoryCreateHandler extends PromptHandler {
    async handle(): Promise<HandlerResponse<any>> {
        const maxLength = 32;
        if (this.prompt.length < 0 || this.prompt.length > maxLength) {
            throw new MenuError(
                Text.Admin.Callback.promptLengthError(maxLength)
            );
        }

        const category = await this.provider.categoryRepository.save(
            new Category({ name: this.prompt })
        );

        return { nextNode: AdminCategoryNode.withParams({ id: category.id }) };
    }
}

export class AdminCategoryRemoveHandler extends Handler<{ id: number }> {
    async handle(): Promise<HandlerResponse<any>> {
        const { id } = this.params;

        await this.provider.productRepository.delete({ categoryId: id });
        await this.provider.categoryRepository.delete({ id });

        return {
            nextNode: AdminCategoryListNode.withParams({ page: 0 }),
            answerMessage: Text.Admin.Callback.categoryRemoved()
        };
    }
}
