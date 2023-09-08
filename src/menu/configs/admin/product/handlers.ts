import { Handler, HandlerResponse, PromptHandler } from '../../../builder';
import { MenuError } from '../../../types';
import { Text } from '../../../text';
import { Product } from '../../../../entities';
import { AdminProductListNode, AdminProductNode } from './nodes';

export enum ProductEditProp {
    Name,
    Description,
    WeightPerPackage
}

export class AdminProductCreateHandler extends PromptHandler<{
    catId: number;
}> {
    async handle(): Promise<HandlerResponse<any>> {
        const maxLength = 32;
        if (this.prompt.length < 0 || this.prompt.length > maxLength) {
            throw new MenuError(Text.Admin.Callback.promptLengthError(32));
        }

        const product = await this.provider.productRepository.save(
            new Product({ name: this.prompt, categoryId: this.params.catId })
        );

        return {
            nextNode: AdminProductNode.withParams({ id: product.id })
        };
    }
}

export class AdminProductEditPropHandler extends PromptHandler<{
    id: number;
    prop: ProductEditProp;
}> {
    async handle(): Promise<HandlerResponse<any>> {
        const maxLengths = {
            [ProductEditProp.Name]: 32,
            [ProductEditProp.WeightPerPackage]: 10
        };
        if (
            maxLengths[this.params.prop] &&
            this.prompt > maxLengths[this.params.prop]
        ) {
            throw new MenuError(
                Text.Admin.Callback.promptLengthError(
                    maxLengths[this.params.prop]
                )
            );
        }

        const propToChange: keyof Product =
            this.params.prop === ProductEditProp.Name
                ? 'name'
                : this.params.prop === ProductEditProp.Description
                ? 'description'
                : 'weightPerPackage';

        await this.provider.productRepository.save({
            id: this.params.id,
            [propToChange]: this.prompt
        });

        return {
            nextNode: AdminProductNode.withParams({ id: this.params.id })
        };
    }
}

export class AdminProductEnableSwitchHandler extends Handler<{ id: number }> {
    async handle(): Promise<HandlerResponse<any>> {
        const { id } = this.params;
        const product = await this.provider.productRepository.findOne({
            where: { id }
        });
        product.isEnabled = !product.isEnabled;
        await this.provider.productRepository.save(product);

        return {
            nextNode: AdminProductNode.withParams({ id }),
            answerMessage: Text.Admin.Callback.productEnableSwitched(
                product.isEnabled
            )
        };
    }
}

export class AdminProductRemoveHandler extends Handler<{ id: number }> {
    async handle(): Promise<HandlerResponse<any>> {
        const { id } = this.params;
        const product = await this.provider.productRepository.findOne({
            where: { id }
        });

        await this.provider.cartEntryRepository.delete({ productId: id });
        await this.provider.productRepository.delete({ id });

        return {
            nextNode: AdminProductListNode.withParams({
                catId: product.categoryId,
                page: 0
            }),
            answerMessage: Text.Admin.Callback.productRemoved()
        };
    }
}
