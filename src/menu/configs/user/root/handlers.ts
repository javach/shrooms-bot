import { HandlerResponse, PromptHandler } from '../../../builder';
import { UserMainNode } from './nodes';

export class UserEditAddressHandler extends PromptHandler {
    async handle(): Promise<HandlerResponse<any>> {
        const user = await this.provider.getUser(this.ctx);
        user.address = this.prompt.replace('>', '').replace('<', '');
        await this.provider.userRepository.save(user);

        return {
            nextNode: UserMainNode.withoutParams()
        };
    }
}
