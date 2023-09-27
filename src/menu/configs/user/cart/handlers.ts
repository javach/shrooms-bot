import { Handler, HandlerResponse, PromptHandler } from '../../../builder';
import { MenuError } from '../../../types';
import { Text } from '../../../text';
import { CartEntry } from '../../../../entities';
import {
    UserCartNode,
    UserCartEditProductsNode,
    UserCartEditCartEntryNode,
    UserCartAddProductNode
} from './nodes';
import { UserCatalogueProductNode } from '../catalogue';

export class UserCartAddProductHandler extends PromptHandler<{ id: number }> {
    async handle(): Promise<HandlerResponse<any>> {
        if (!/^[0-9]*$/.test(this.prompt)) {
            throw new MenuError(Text.User.Callback.errorNotANumber());
        }
        const quantity = Number(this.prompt);

        if (quantity <= 0) {
            throw new MenuError(Text.User.Callback.errorNonPositiveNumber());
        }

        const user = await this.provider.getUser(this.ctx);

        let cartEntry =
            (await this.provider.cartEntryRepository.findOne({
                where: {
                    userId: user.id,
                    productId: this.params.id
                }
            })) ||
            new CartEntry({ userId: user.id, productId: this.params.id });

        cartEntry.quantity = quantity;
        cartEntry = await this.provider.cartEntryRepository.save(cartEntry);

        return {
            nextNode: UserCartAddProductNode.withParams({
                id: cartEntry.productId
            })
        };
    }
}

export class UserCartEditCartEntryHandler extends UserCartAddProductHandler {
    async handle(): Promise<HandlerResponse<any>> {
        await super.handle();
        return {
            nextNode: UserCartEditCartEntryNode.withParams({
                id: this.params.id
            })
        };
    }
}

export class UserCartRemoveCartEntryHandler extends Handler<{ id: number }> {
    async handle(): Promise<HandlerResponse<any>> {
        await this.provider.cartEntryRepository.delete({ id: this.params.id });
        return {
            nextNode: UserCartEditProductsNode.withParams({ page: 0 }),
            answerMessage: Text.User.Callback.cartEntryRemoved()
        };
    }
}

export class UserCartCancelAddCartEntryHandler extends UserCartRemoveCartEntryHandler {
    async handle(): Promise<HandlerResponse<any>> {
        const cartEntry = await this.provider.cartEntryRepository.findOne({
            where: { id: this.params.id }
        });
        const productId = cartEntry.productId;
        await this.provider.cartEntryRepository.delete({ id: this.params.id });
        return {
            nextNode: UserCatalogueProductNode.withParams({ id: productId }),
            answerMessage: Text.User.Callback.cartEntryRemoved()
        };
    }
}

export class UserCartEditAddressHandler extends PromptHandler {
    async handle(): Promise<HandlerResponse<any>> {
        const user = await this.provider.getUser(this.ctx);
        user.address = this.prompt.replace('>', '').replace('<', '');
        await this.provider.userRepository.save(user);

        return { nextNode: UserCartNode.withoutParams() };
    }
}
