import { Injectable } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { MenuError, SessionContext } from '../types';
import { Commands } from '../text';
import { callbackQuery } from 'telegraf/filters';
import {
    HandlerResponse,
    KeyboardButton,
    MenuNode,
    PromptHandler
} from '../builder';
import { Context } from 'telegraf';
import { USER_ROLE } from '../../entities';

@Injectable()
export class MenuService {
    constructor(private readonly providerService: ProviderService) {}

    async setUserAsAdmin(ctx: SessionContext) {
        const user = await this.providerService.getUser(ctx);
        user.role = USER_ROLE.ADMIN;
        await this.providerService.userRepository.save(user);
    }

    async processCommand(command: Commands, ctx: SessionContext) {
        this.ensureContext(ctx);

        const node = this.providerService.getNodeByCommand(command);
        if (!node) return false;

        const { text, keyboard } = await this.getNode(
            node.id,
            ctx
        ).getMessage();

        await ctx.sendMessage(text, {
            reply_markup: keyboard.encode(),
            parse_mode: 'HTML'
        });
    }

    async processCallback(ctx: SessionContext) {
        if (!ctx.has(callbackQuery('data'))) return;

        this.ensureContext(ctx);

        const { handlerId, params } = KeyboardButton.decodeCallbackData(
            ctx.callbackQuery.data
        );
        const handler = this.getHandler(handlerId, ctx, params);

        let response: HandlerResponse<any> = null;

        try {
            response = await handler.handle();
        } catch (e) {
            if (e instanceof MenuError) {
                await ctx.answerCbQuery(e.message);
                return;
            }
            await ctx.answerCbQuery();
            throw e;
        }

        const { nextNode, answerMessage } = response;

        const node = this.getNode(nextNode.type.id, ctx, nextNode.params);

        if (node.promptHandler) {
            this.setPrompt(
                ctx,
                nextNode.type,
                nextNode.params,
                ctx.callbackQuery.message.message_id
            );
        } else {
            this.clearPrompt(ctx);
        }

        await ctx.answerCbQuery(answerMessage);

        const { text, keyboard } = await node.getMessage();

        try {
            await ctx.editMessageText(text, {
                reply_markup: keyboard.encode(),
                parse_mode: 'HTML'
            });
        } catch (e) {
            if (e.message.includes('message is not modified')) return;
            await ctx.sendMessage(text, {
                reply_markup: keyboard.encode(),
                parse_mode: 'HTML'
            });
        }
    }

    async processText(ctx: SessionContext) {
        if (!('text' in ctx.message) || !ctx.session.prompt) return;

        this.ensureContext(ctx);

        const prevNode = this.getNode(
            ctx.session.prompt.nodeId,
            ctx,
            ctx.session.prompt.params
        );

        const promptHandler = this.getHandler(
            prevNode.promptHandler.id,
            ctx,
            ctx.session.prompt.params,
            ctx.message.text
        );

        await ctx.deleteMessage(ctx.session.prompt.messageId).catch();

        let response: HandlerResponse<any> = null;

        try {
            response = await promptHandler.handle();
        } catch (e) {
            if (e instanceof MenuError) {
                const { text, keyboard } = await prevNode.getMessage();
                const newText = `<b>${e.message}</b>\n\n${text}`;
                const message = await ctx.sendMessage(newText, {
                    reply_markup: keyboard.encode(),
                    parse_mode: 'HTML'
                });
                ctx.session.prompt.messageId = message.message_id;
                return;
            }
            throw e;
        }

        const { nextNode } = response;

        const { text, keyboard } = await this.getNode(
            nextNode.type.id,
            ctx,
            nextNode.params
        ).getMessage();

        await ctx.sendMessage(text, {
            reply_markup: keyboard.encode(),
            parse_mode: 'HTML'
        });
    }

    private getHandler(
        id: string,
        ctx: Context,
        params?: any,
        prompt?: string
    ) {
        const handler = this.providerService.getHandler(id);
        if (handler.prototype instanceof PromptHandler) {
            return new (handler as typeof PromptHandler)(
                this.providerService,
                ctx,
                params,
                prompt
            );
        }
        return new (this.providerService.getHandler(id))(
            this.providerService,
            ctx,
            params
        );
    }

    private getNode(id: string, ctx: Context, params?: any) {
        return new (this.providerService.getNode(id))(
            this.providerService,
            ctx,
            params
        );
    }

    private ensureContext(ctx: SessionContext) {
        if (!ctx.session) ctx.session = {};
    }

    private setPrompt(
        ctx: SessionContext,
        node: typeof MenuNode<any>,
        params: any,
        messageId: number
    ) {
        ctx.session.prompt = {
            nodeId: node.id,
            messageId,
            params
        };
    }

    private clearPrompt(ctx: SessionContext) {
        ctx.session = {};
    }
}
