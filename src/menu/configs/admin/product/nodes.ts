import {
    EntityPagedListNode,
    Keyboard,
    KeyboardButton,
    MenuNode,
    MoveButton
} from '../../../builder';
import { Product } from '../../../../entities';
import { FindManyOptions, Repository } from 'typeorm';
import { Text } from '../../../text';
import { AdminCategoryNode } from '../category';
import {
    AdminProductCreateHandler,
    AdminProductEditPropHandler,
    AdminProductEnableSwitchHandler,
    AdminProductRemoveHandler,
    ProductEditProp
} from './handlers';

export class AdminProductListNode extends EntityPagedListNode<
    Product,
    { catId: number }
> {
    protected limit = 10;

    protected getQuery(): FindManyOptions<Product> {
        return {
            where: { categoryId: this.params.catId }
        };
    }

    protected getRepository(): Repository<Product> {
        return this.provider.productRepository;
    }

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const category = await this.provider.categoryRepository.findOne({
            where: { id: this.params.catId }
        });
        const { entities, page, maxPage } = await this.getPagedEntities();

        const keyboard = new Keyboard()
            .generatePagedListButtons({
                getEntityButton: (entity) =>
                    new MoveButton({
                        text: Text.General.Buttons.product(entity),
                        node: AdminProductNode.withParams({ id: entity.id })
                    }),
                getPageControlButton: (text, page) =>
                    new MoveButton({
                        text,
                        node: AdminProductListNode.withParams({
                            catId: this.params.catId,
                            page
                        })
                    }),
                entities,
                page,
                maxPage
            })
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.productCreate(),
                    node: AdminProductCreateNode.withParams({
                        catId: this.params.catId
                    })
                })
            )
            .addBackButton(
                AdminCategoryNode.withParams({ id: this.params.catId })
            );

        return {
            text: Text.Admin.Nodes.productList(category),
            keyboard
        };
    }
}

export class AdminProductNode extends MenuNode<{ id: number }> {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { id } = this.params;
        const product = await this.provider.productRepository.findOne({
            where: { id }
        });

        const keyboard = new Keyboard()
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.editName(),
                    node: AdminProductEditPropNode.withParams({
                        id,
                        prop: ProductEditProp.Name
                    })
                })
            )
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.editDescription(),
                    node: AdminProductEditPropNode.withParams({
                        id,
                        prop: ProductEditProp.Description
                    })
                })
            )
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.editWeightPerPackage(),
                    node: AdminProductEditPropNode.withParams({
                        id,
                        prop: ProductEditProp.WeightPerPackage
                    })
                })
            )
            .addRow(
                new KeyboardButton({
                    text: Text.Admin.Buttons.switch(product.isEnabled),
                    handler: AdminProductEnableSwitchHandler.withParams({ id })
                })
            )
            .addBackButton(
                AdminProductListNode.withParams({
                    catId: product.categoryId,
                    page: 0
                })
            );

        return { text: Text.Admin.Nodes.productDetail(product), keyboard };
    }
}

export class AdminProductCreateNode extends MenuNode<{ catId: number }> {
    promptHandler = AdminProductCreateHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.Admin.Nodes.productCreate(),
            keyboard: new Keyboard().addBackButton(
                AdminCategoryNode.withParams({ id: this.params.catId })
            )
        };
    }
}

export class AdminProductEditPropNode extends MenuNode<{
    prop: ProductEditProp;
    id: number;
}> {
    promptHandler = AdminProductEditPropHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.Admin.Nodes.productEditProp(this.params.prop),
            keyboard: new Keyboard().addBackButton(
                AdminProductNode.withParams({ id: this.params.id })
            )
        };
    }
}

export class AdminProductRemoveConfirmationNode extends MenuNode<{
    id: number;
}> {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.Admin.Nodes.productRemoveConfirm(),
            keyboard: new Keyboard()
                .addRow(
                    new KeyboardButton({
                        text: Text.Admin.Buttons.remove(),
                        handler: AdminProductRemoveHandler.withParams({
                            id: this.params.id
                        })
                    })
                )
                .addBackButton(
                    AdminProductNode.withParams({ id: this.params.id })
                )
        };
    }
}
