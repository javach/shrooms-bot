import { Handler, HandlerResponse, PromptHandler } from '../../../builder';
import { AdminArticleListNode, AdminArticleNode } from './nodes';
import { Article } from '../../../../entities';
import { MenuError } from '../../../types';
import { Text } from '../../../text';

export enum ArticleEditProp {
    Name,
    Url
}

export class AdminArticleCreateHandler extends PromptHandler {
    async handle(): Promise<HandlerResponse<any>> {
        const article = await this.provider.articleRepository.save({
            name: this.prompt
        });

        return {
            nextNode: AdminArticleNode.withParams({ id: article.id })
        };
    }
}

export class AdminArticleEditPropHandler extends PromptHandler<{
    id: number;
    prop: ArticleEditProp;
}> {
    async handle(): Promise<HandlerResponse<any>> {
        const propToChange: keyof Article =
            this.params.prop === ArticleEditProp.Name ? 'name' : 'url';
        await this.provider.articleRepository.save({
            id: this.params.id,
            [propToChange]: this.prompt
        });

        return {
            nextNode: AdminArticleNode.withParams({ id: this.params.id })
        };
    }
}

export class AdminArticleConnectProductHandler extends PromptHandler<{
    id: number;
    prId: number;
}> {
    async handle(): Promise<HandlerResponse<any>> {
        if (this.params.prId !== null && this.params.prId !== undefined) {
            const productCount = await this.provider.productRepository.count({
                where: { id: this.params.prId }
            });
            if (productCount === 0) {
                throw new MenuError(Text.Admin.Callback.productDontExist());
            }
        }

        await this.provider.articleRepository.save({
            id: this.params.id,
            productId: this.params.prId
        });

        return {
            nextNode: AdminArticleNode.withParams({ id: this.params.prId })
        };
    }
}

export class AdminArticleRemoveHandler extends Handler<{ id: number }> {
    async handle(): Promise<HandlerResponse<any>> {
        await this.provider.articleRepository.delete({ id: this.params.id });

        return {
            nextNode: AdminArticleListNode.withParams({ page: 0 }),
            answerMessage: Text.Admin.Callback.articleRemoved()
        };
    }
}
