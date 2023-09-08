import {
    EntityPagedListNode,
    Keyboard,
    MenuNode,
    MoveButton
} from '../../../builder';
import { Category, Product } from '../../../../entities';
import { FindManyOptions, Repository } from 'typeorm';
import { Text } from '../../../text';
import { UserMainNode } from '../root';
import { UserCartAddProductNode } from '../cart';
import { UserProductReviewListNode } from '../review';

export class UserCatalogueNode extends EntityPagedListNode<Category> {
    protected limit = 5;

    protected getRepository(): Repository<Category> {
        return this.provider.categoryRepository;
    }

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { entities, page, maxPage } = await this.getPagedEntities();

        const keyboard = new Keyboard()
            .generatePagedListButtons({
                getEntityButton: (entity) =>
                    new MoveButton({
                        text: Text.General.Buttons.category(entity),
                        node: UserCatalogueCategoryNode.withParams({
                            page: 0,
                            id: entity.id
                        })
                    }),
                getPageControlButton: (text, page) =>
                    new MoveButton({
                        text,
                        node: UserCatalogueNode.withParams({ page })
                    }),
                maxPage,
                page,
                entities
            })
            .addBackButton(UserMainNode.withoutParams());

        return {
            text: Text.User.Nodes.catalogue(),
            keyboard
        };
    }
}

export class UserCatalogueCategoryNode extends EntityPagedListNode<
    Product,
    { id: number }
> {
    protected limit = 6;

    protected getQuery(): FindManyOptions<Product> {
        return {
            where: { categoryId: this.params.id, isEnabled: true }
        };
    }

    protected getRepository(): Repository<Product> {
        return this.provider.productRepository;
    }

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const category = await this.provider.categoryRepository.findOne({
            where: { id: this.params.id }
        });
        const { entities, page, maxPage } = await this.getPagedEntities();

        const keyboard = new Keyboard()
            .generatePagedListButtons({
                getEntityButton: (entity) =>
                    new MoveButton({
                        text: Text.General.Buttons.product(entity),
                        node: UserCatalogueProductNode.withParams({
                            id: entity.id
                        })
                    }),
                getPageControlButton: (text, page) =>
                    new MoveButton({
                        text,
                        node: UserCatalogueCategoryNode.withParams({
                            page,
                            id: this.params.id
                        })
                    }),
                entities,
                maxPage,
                page
            })
            .addBackButton(UserCatalogueNode.withParams({ page: 0 }));

        return {
            text: Text.User.Nodes.catalogueCategory(category),
            keyboard
        };
    }
}

export class UserCatalogueProductNode extends MenuNode<{ id: number }> {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { id } = this.params;
        const product = await this.provider.productRepository.findOne({
            where: { id }
        });

        const keyboard = new Keyboard();

        if (product.isEnabled) {
            keyboard.addRow(
                new MoveButton({
                    text: Text.User.Buttons.addToCart(),
                    node: UserCartAddProductNode.withParams({ id })
                })
            );
        }

        keyboard
            .addRow(
                new MoveButton({
                    text: Text.User.Buttons.reviews(),
                    node: UserProductReviewListNode.withParams({
                        id: this.params.id,
                        page: 0
                    })
                })
            )
            .addBackButton(
                UserCatalogueCategoryNode.withParams({
                    id: product.categoryId,
                    page: 0
                })
            );

        return { text: Text.User.Nodes.catalogueProduct(product), keyboard };
    }
}
