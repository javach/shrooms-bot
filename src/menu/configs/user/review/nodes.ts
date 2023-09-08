import {
    EntityPagedListNode,
    Keyboard,
    MenuNode,
    MoveButton
} from '../../../builder';
import { Review } from '../../../../entities';
import { FindManyOptions, Repository } from 'typeorm';
import { Text } from '../../../text';
import { UserCatalogueProductNode } from '../catalogue';
import { UserProductReviewAddHandler } from './handlers';

export class UserProductReviewListNode extends EntityPagedListNode<
    Review,
    { id: number }
> {
    protected limit = 5;

    protected getRepository(): Repository<Review> {
        return this.provider.reviewRepository;
    }

    protected getQuery(): FindManyOptions<Review> {
        return {
            where: { productId: this.params.id }
        };
    }

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const product = await this.provider.productRepository.findOne({
            where: { id: this.params.id }
        });
        const { entities, page, maxPage } = await this.getPagedEntities();

        const keyboard = new Keyboard()
            .generatePageControlButtons({
                page,
                maxPage,
                getPageControlButton: (text, page) =>
                    new MoveButton({
                        text,
                        node: UserProductReviewListNode.withParams({
                            id: this.params.id,
                            page
                        })
                    })
            })
            .addRow(
                new MoveButton({
                    text: Text.User.Buttons.addReview(),
                    node: UserProductReviewAddNode.withParams({
                        id: this.params.id
                    })
                })
            )
            .addBackButton(
                UserCatalogueProductNode.withParams({ id: this.params.id })
            );

        return {
            text: Text.User.Nodes.reviews(product, entities, page, maxPage),
            keyboard
        };
    }
}

export class UserProductReviewAddNode extends MenuNode<{ id: number }> {
    promptHandler = UserProductReviewAddHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const product = await this.provider.productRepository.findOne({
            where: { id: this.params.id }
        });
        return {
            text: Text.User.Nodes.reviewAdd(product),
            keyboard: new Keyboard().addBackButton(
                UserProductReviewListNode.withParams({
                    id: this.params.id,
                    page: 0
                })
            )
        };
    }
}

export class UserProductReviewAddSuccessNode extends MenuNode<{ id: number }> {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.User.Nodes.reviewAddSuccess(),
            keyboard: new Keyboard().addBackButton(
                UserProductReviewListNode.withParams({
                    page: 0,
                    id: this.params.id
                })
            )
        };
    }
}
