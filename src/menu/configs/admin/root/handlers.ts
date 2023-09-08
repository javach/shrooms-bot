import { Handler, HandlerResponse } from '../../../builder';
import { AdminMainNode } from './nodes';
import { Text } from '../../../text';

export class AdminSubscribeSwitchHandler extends Handler {
    async handle(): Promise<HandlerResponse<any>> {
        const user = await this.provider.getUser(this.ctx);
        user.isSubscribed = !user.isSubscribed;
        await this.provider.userRepository.save(user);

        return {
            nextNode: AdminMainNode.withoutParams(),
            answerMessage: Text.Admin.Callback.subscribeSwitched(
                user.isSubscribed
            )
        };
    }
}
