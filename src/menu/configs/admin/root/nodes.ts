import {
    MenuNode,
    Keyboard,
    MoveButton,
    KeyboardButton
} from '../../../builder';
import { Commands, Text } from '../../../text';
import { AdminCategoryListNode } from '../category';
import { AdminSubscribeSwitchHandler } from './handlers';
import { AdminArticleListNode } from '../article';

export class AdminMainNode extends MenuNode {
    static entryCommand = Commands.Admin;

    async getMessage(): Promise<{ text: string; keyboard: Keyboard }> {
        const user = await this.provider.getUser(this.ctx);
        return {
            text: Text.Admin.Nodes.main(user.isSubscribed),
            keyboard: new Keyboard()
                .addRow(
                    new MoveButton({
                        text: Text.Admin.Buttons.toCategoryList(),
                        node: AdminCategoryListNode.withParams({ page: 0 })
                    })
                )
                .addRow(
                    new MoveButton({
                        text: Text.Admin.Buttons.toArticleList(),
                        node: AdminArticleListNode.withParams({ page: 0 })
                    })
                )
                .addRow(
                    new KeyboardButton({
                        text: Text.Admin.Buttons.subscribe(user.isSubscribed),
                        handler: AdminSubscribeSwitchHandler.withoutParams()
                    })
                )
        };
    }
}
