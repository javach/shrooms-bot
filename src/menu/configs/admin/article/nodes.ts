import {
    EntityPagedListNode,
    Keyboard,
    KeyboardButton,
    MenuNode,
    MoveButton
} from '../../../builder';
import { Article, Product } from '../../../../entities';
import { Text } from '../../../text';
import {
    AdminArticleConnectProductHandler,
    AdminArticleCreateHandler,
    AdminArticleEditPropHandler,
    AdminArticleRemoveHandler,
    ArticleEditProp
} from './handlers';
import { AdminMainNode } from '../root';
import { Repository } from 'typeorm';

export class AdminArticleListNode extends EntityPagedListNode<Article> {
    protected limit = 5;

    protected getRepository(): Repository<Article> {
        return this.provider.articleRepository;
    }

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { entities, page, maxPage } = await this.getPagedEntities();

        const keyboard = new Keyboard()
            .generatePagedListButtons({
                getEntityButton: (entity) =>
                    new MoveButton({
                        text: Text.General.Buttons.article(entity),
                        node: AdminArticleNode.withParams({ id: entity.id })
                    }),
                getPageControlButton: (text, page) =>
                    new MoveButton({
                        text,
                        node: AdminArticleListNode.withParams({ page })
                    }),
                entities,
                page,
                maxPage,
                rowLimit: 1
            })
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.articleCreate(),
                    node: AdminArticleCreateNode.withoutParams()
                })
            )
            .addRow(
                new MoveButton({
                    text: Text.General.Buttons.back(),
                    node: AdminMainNode.withoutParams()
                })
            );

        return { text: Text.Admin.Nodes.articleList(page, maxPage), keyboard };
    }
}

export class AdminArticleNode extends MenuNode<{ id: number }> {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { id } = this.params;
        const article = await this.provider.articleRepository.findOne({
            where: { id },
            relations: ['product']
        });

        const keyboard = new Keyboard()
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.editName(),
                    node: AdminArticleEditPropNode.withParams({
                        id,
                        prop: ArticleEditProp.Name
                    })
                })
            )
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.editUrl(),
                    node: AdminArticleEditPropNode.withParams({
                        id,
                        prop: ArticleEditProp.Url
                    })
                })
            )
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.articleEditProduct(
                        Boolean(article.productId)
                    ),
                    node: AdminArticleConnectProductNode.withParams({
                        id,
                        page: 0
                    })
                })
            )
            .addRow(
                new KeyboardButton({
                    text: Text.Admin.Buttons.remove(),
                    handler: AdminArticleRemoveHandler.withParams({ id })
                })
            )
            .addBackButton(AdminArticleListNode.withParams({ page: 0 }));

        return {
            text: Text.Admin.Nodes.articleDetail(article),
            keyboard
        };
    }
}

export class AdminArticleCreateNode extends MenuNode {
    promptHandler = AdminArticleCreateHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.Admin.Nodes.articleCreate(),
            keyboard: new Keyboard().addBackButton(
                AdminArticleListNode.withParams({ page: 0 })
            )
        };
    }
}

export class AdminArticleEditPropNode extends MenuNode<{
    id: number;
    prop: ArticleEditProp;
}> {
    promptHandler = AdminArticleEditPropHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.Admin.Nodes.articleEditProp(this.params.prop),
            keyboard: new Keyboard().addBackButton(
                AdminArticleNode.withParams({ id: this.params.id })
            )
        };
    }
}

export class AdminArticleConnectProductNode extends EntityPagedListNode<
    Product,
    { id: number }
> {
    protected limit = 6;

    protected getRepository(): Repository<Product> {
        return this.provider.productRepository;
    }

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { id } = this.params;
        const { entities, maxPage, page } = await this.getPagedEntities();
        const article = await this.provider.articleRepository.findOne({
            where: { id }
        });

        const keyboard = new Keyboard().generatePagedListButtons({
            getEntityButton: (entity) =>
                new KeyboardButton({
                    text: Text.General.Buttons.product(entity),
                    handler: AdminArticleConnectProductHandler.withParams({
                        id,
                        prId: entity.id
                    })
                }),
            getPageControlButton: (text, page) =>
                new MoveButton({
                    text,
                    node: AdminArticleConnectProductNode.withParams({
                        page,
                        id
                    })
                }),
            page,
            maxPage,
            entities
        });

        if (article.productId) {
            keyboard.addRow(
                new KeyboardButton({
                    text: Text.Admin.Buttons.articleDisconnectProduct(),
                    handler: AdminArticleConnectProductHandler.withParams({
                        id,
                        prId: null
                    })
                })
            );
        }

        keyboard.addBackButton(AdminArticleNode.withParams({ id }));

        return { text: Text.Admin.Nodes.articleConnect(), keyboard };
    }
}
