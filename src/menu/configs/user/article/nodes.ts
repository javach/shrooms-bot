import { Keyboard, MenuNode, MoveButton } from '../../../builder';
import { In, IsNull, Not } from 'typeorm';
import { Text } from '../../../text';
import { UserMainNode } from '../root';

export class UserArticleByProductListNode extends MenuNode {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const distinctProductIds = await this.provider.articleRepository
            .createQueryBuilder('entity')
            .where('entity.url IS NOT NULL')
            .select('productId')
            .distinct(true)
            .getRawMany()
            .then((res) => res.map((x) => x.productId));

        const products = await this.provider.productRepository.find({
            where: { id: In(distinctProductIds.filter((x) => x)) }
        });

        const buttons = products.map(
            (product) =>
                new MoveButton({
                    text: Text.General.Buttons.product(product),
                    node: UserArticleByProductNode.withParams({
                        id: product.id
                    })
                })
        );

        if (distinctProductIds.includes(null)) {
            buttons.push(
                new MoveButton({
                    text: Text.General.Buttons.common(),
                    node: UserArticleByProductNode.withParams({
                        id: null
                    })
                })
            );
        }

        const keyboard = new Keyboard();

        if (buttons.length) keyboard.splitAndAddRows(buttons, 2);

        keyboard.addBackButton(UserMainNode.withoutParams());

        return {
            text: Text.User.Nodes.articleProductList(
                distinctProductIds.length > 0
            ),
            keyboard
        };
    }
}

export class UserArticleByProductNode extends MenuNode<{ id: number }> {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const { id } = this.params;
        const product =
            id !== null
                ? await this.provider.productRepository.findOne({
                      where: { id }
                  })
                : null;

        const articles = await this.provider.articleRepository.find({
            where: {
                productId: id !== null ? id : IsNull(),
                url: Not(IsNull())
            }
        });

        return {
            text: Text.User.Nodes.articles(product, articles),
            keyboard: new Keyboard().addBackButton(
                UserArticleByProductListNode.withoutParams()
            )
        };
    }
}
