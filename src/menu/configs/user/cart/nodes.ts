import {
    EntityPagedListNode,
    Keyboard,
    KeyboardButton,
    MenuNode,
    MoveButton
} from '../../../builder';
import { Text } from '../../../text';
import {
    UserCatalogueCategoryNode,
    UserCatalogueNode,
    UserCatalogueProductNode
} from '../catalogue';
import {
    UserCartAddProductHandler,
    UserCartCancelAddCartEntryHandler,
    UserCartEditAddressHandler,
    UserCartEditCartEntryHandler,
    UserCartRemoveCartEntryHandler
} from './handlers';
import { CartEntry } from '../../../../entities';
import { UserMainNode } from '../root';
import { FindManyOptions, Repository } from 'typeorm';

export class UserCartNode extends MenuNode {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const user = await this.provider.getUser(this.ctx);
        const cartEntries = await this.provider.cartEntryRepository.find({
            where: { userId: user.id },
            relations: ['product']
        });

        const keyboard = new Keyboard()
            .addRow(
                new MoveButton({
                    text: Text.User.Buttons.editCart(),
                    node: UserCartEditProductsNode.withParams({ page: 0 })
                })
            )
            .addRow(
                new MoveButton({
                    text: Text.User.Buttons.editAddress(user),
                    node: UserCartEditAddressNode.withoutParams()
                })
            );

        if (user.address) {
            keyboard.addRow(
                new MoveButton({
                    text: Text.User.Buttons.confirmOrder(),
                    node: UserCartConfirmOrderNode.withoutParams()
                })
            );
        }

        keyboard.addRow(
            new MoveButton({
                text: Text.User.Buttons.toMainMenu(),
                node: UserMainNode.withoutParams()
            })
        );

        return {
            text: Text.User.Nodes.cart(user, cartEntries),
            keyboard
        };
    }
}

export class UserCartEditAddressNode extends MenuNode {
    promptHandler = UserCartEditAddressHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.User.Nodes.editAddress(),
            keyboard: new Keyboard().addBackButton(UserCartNode.withoutParams())
        };
    }
}

export class UserCartEditProductsNode extends EntityPagedListNode<CartEntry> {
    protected limit = 4;

    protected getRepository(): Repository<CartEntry> {
        return this.provider.cartEntryRepository;
    }

    protected getQuery(queryParams?: {
        userId: number;
    }): FindManyOptions<CartEntry> {
        return {
            where: { userId: queryParams.userId },
            relations: ['product']
        };
    }

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const user = await this.provider.getUser(this.ctx);
        const { entities, maxPage, page } = await this.getPagedEntities({
            userId: user.id
        });

        const keyboard = new Keyboard()
            .generatePagedListButtons({
                getEntityButton: (entity) =>
                    new MoveButton({
                        text: Text.General.Buttons.cartEntry(entity),
                        node: UserCartEditCartEntryNode.withParams({
                            id: entity.id
                        })
                    }),
                getPageControlButton: (text, page) =>
                    new MoveButton({
                        text,
                        node: UserCartEditProductsNode.withParams({ page })
                    }),
                entities,
                maxPage,
                page,
                rowLimit: 1
            })
            .addBackButton(UserCartNode.withoutParams());

        return {
            text: Text.User.Nodes.cartEdit(),
            keyboard
        };
    }
}

export class UserCartEditCartEntryNode extends MenuNode<{ id: number }> {
    promptHandler = UserCartEditCartEntryHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const cartEntry = await this.provider.cartEntryRepository.findOne({
            where: { id: this.params.id },
            relations: ['product']
        });

        const keyboard = new Keyboard()
            .addRow(
                new KeyboardButton({
                    text: Text.User.Buttons.removeFromCart(),
                    handler: UserCartRemoveCartEntryHandler.withParams({
                        id: this.params.id
                    })
                })
            )
            .addBackButton(UserCartEditProductsNode.withParams({ page: 0 }));

        return {
            text: Text.User.Nodes.cartEntryEdit(cartEntry),
            keyboard
        };
    }
}

export class UserCartAddProductNode extends MenuNode<{ id: number }> {
    promptHandler = UserCartAddProductHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const user = await this.provider.getUser(this.ctx);
        const product = await this.provider.productRepository.findOne({
            where: { id: this.params.id }
        });
        let cartEntry = await this.provider.cartEntryRepository.findOne({
            where: { productId: this.params.id, userId: user.id },
            relations: ['product']
        });

        if (!cartEntry) {
            cartEntry = await this.provider.cartEntryRepository.save({
                product,
                productId: product.id,
                userId: user.id,
                quantity: 1
            });
        }

        const keyboard = new Keyboard()
            .addRow(
                new MoveButton({
                    text: Text.User.Buttons.toContinue(),
                    node: UserCatalogueNode.withParams({ page: 0 })
                })
            )
            .addRow(
                new MoveButton({
                    text: Text.User.Buttons.toCart(),
                    node: UserCartNode.withoutParams()
                })
            )
            .addRow(
                new KeyboardButton({
                    text: Text.User.Buttons.cancel(),
                    handler: UserCartCancelAddCartEntryHandler.withParams({
                        id: cartEntry.id
                    })
                })
            );

        return {
            text: Text.User.Nodes.productAdd(product, cartEntry),
            keyboard
        };
    }
}

export class UserCartConfirmOrderNode extends MenuNode {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const user = await this.provider.getUser(this.ctx);
        const entries = await this.provider.cartEntryRepository.find({
            where: { userId: user.id },
            relations: ['product']
        });

        const usersToNotify = await this.provider.userRepository.find({
            where: { isSubscribed: true }
        });

        for (const userToNotify of usersToNotify) {
            await this.ctx.telegram.sendMessage(
                userToNotify.chatId,
                Text.User.Other.orderNotify(
                    user,
                    entries,
                    this.ctx.from.username
                ),
                { parse_mode: 'HTML' }
            );
        }

        await this.provider.cartEntryRepository.delete({ userId: user.id });

        return {
            text: Text.User.Other.orderConfirm(
                user,
                entries,
                this.ctx.from.username
            ),
            keyboard: new Keyboard().addRow(
                new MoveButton({
                    text: Text.User.Buttons.toMainMenu(),
                    node: UserMainNode.withoutParams()
                })
            )
        };
    }
}
