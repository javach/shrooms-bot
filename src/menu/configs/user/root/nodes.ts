import { Keyboard, MenuNode, MoveButton } from '../../../builder';
import { Commands, Text } from '../../../text';
import { UserEditAddressHandler } from './handlers';
import { UserCatalogueNode } from '../catalogue';
import { UserCartNode } from '../cart';
import { UserArticleByProductListNode } from '../article';

export class UserMainNode extends MenuNode {
    static entryCommand = Commands.Menu;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const user = await this.provider.getUser(this.ctx);
        const keyboard = new Keyboard().splitAndAddRows(
            [
                new MoveButton({
                    text: Text.User.Buttons.catalogue(),
                    node: UserCatalogueNode.withParams({ page: 0 })
                }),
                new MoveButton({
                    text: Text.User.Buttons.cart(),
                    node: UserCartNode.withoutParams()
                }),
                new MoveButton({
                    text: Text.User.Buttons.articles(),
                    node: UserArticleByProductListNode.withoutParams()
                }),
                new MoveButton({
                    text: Text.User.Buttons.editAddress(user),
                    node: UserEditAddressNode.withoutParams()
                }),
                new MoveButton({
                    text: Text.User.Buttons.toContacts(),
                    node: UserContactsNode.withoutParams()
                })
            ],
            2
        );

        return {
            text: Text.User.Nodes.main(user),
            keyboard
        };
    }
}

export class UserEditAddressNode extends MenuNode {
    promptHandler = UserEditAddressHandler;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.User.Nodes.editAddress(),
            keyboard: new Keyboard().addBackButton(UserMainNode.withoutParams())
        };
    }
}

export class UserContactsNode extends MenuNode {
    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        return {
            text: Text.User.Nodes.contacts(),
            keyboard: new Keyboard().addBackButton(UserMainNode.withoutParams())
        };
    }
}
