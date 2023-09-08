import { Category } from '../../../../entities';
import {
    Keyboard,
    MenuNode,
    MoveButton,
    EntityPagedListNode,
    KeyboardButton
} from '../../../builder';
import { Repository } from 'typeorm';
import { AdminMainNode } from '../root';
import { Text } from '../../../text';
import {
    AdminCategoryCreateHandler,
    AdminCategoryEditNameHandler,
    AdminCategoryRemoveHandler
} from './handlers';
import { AdminProductListNode } from '../product/nodes';

export class AdminCategoryListNode extends EntityPagedListNode<Category> {
    protected limit = 10;

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
                        node: AdminCategoryNode.withParams({ id: entity.id })
                    }),
                getPageControlButton: (text, page) =>
                    new MoveButton({
                        text,
                        node: AdminCategoryListNode.withParams({ page })
                    }),
                entities,
                page,
                maxPage
            })
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.categoryCreate(),
                    node: AdminCategoryCreateNode.withoutParams()
                })
            )
            .addBackButton(AdminMainNode.withoutParams());

        return {
            text: Text.Admin.Nodes.categoryList(),
            keyboard
        };
    }
}

export class AdminCategoryNode extends MenuNode<{ id: number }> {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { id } = this.params;
        const productCount = await this.provider.productRepository.count({
            where: { categoryId: id }
        });
        const category = await this.provider.categoryRepository.findOne({
            where: { id }
        });

        const keyboard = new Keyboard()
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.editName(),
                    node: AdminCategoryEditNameNode.withParams({
                        id
                    })
                })
            )
            .addRow(
                new MoveButton({
                    text: Text.Admin.Buttons.toProductList(),
                    node: AdminProductListNode.withParams({
                        catId: id,
                        page: 0
                    })
                })
            )
            .addRow(
                productCount > 0
                    ? new MoveButton({
                          text: Text.Admin.Buttons.remove(),
                          node: AdminCategoryRemoveConfirmationNode.withParams({
                              id
                          })
                      })
                    : new KeyboardButton({
                          text: Text.Admin.Buttons.remove(),
                          handler: AdminCategoryRemoveHandler.withParams({ id })
                      })
            )
            .addBackButton(AdminCategoryListNode.withParams({ page: 0 }));

        return {
            text: Text.Admin.Nodes.categoryDetail(category, productCount),
            keyboard
        };
    }
}

export class AdminCategoryCreateNode extends MenuNode {
    promptHandler = AdminCategoryCreateHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.Admin.Nodes.categoryCreate(),
            keyboard: new Keyboard().addBackButton(
                AdminCategoryListNode.withParams({ page: 0 })
            )
        };
    }
}

export class AdminCategoryEditNameNode extends MenuNode<{ id: number }> {
    promptHandler = AdminCategoryEditNameHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.Admin.Nodes.categoryEditName(),
            keyboard: new Keyboard().addBackButton(
                AdminCategoryNode.withParams({ id: this.params.id })
            )
        };
    }
}

export class AdminCategoryRemoveConfirmationNode extends MenuNode<{
    id: number;
}> {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { id } = this.params;
        const category = await this.provider.categoryRepository.findOne({
            where: { id }
        });
        return {
            text: Text.Admin.Nodes.categoryRemoveConfirm(category),
            keyboard: new Keyboard().addBackButton(
                AdminCategoryNode.withParams({ id })
            )
        };
    }
}
