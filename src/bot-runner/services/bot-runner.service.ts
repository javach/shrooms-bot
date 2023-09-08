import { Injectable, OnModuleInit } from '@nestjs/common';
import { callbackQuery } from 'telegraf/filters';
import { Command, Ctx, InjectBot, On, Update } from 'nestjs-telegraf';
import { MenuService } from '../../menu/services';
import { SessionContext } from '../../menu/types';
import { Telegraf } from 'telegraf';
import { Commands } from '../../menu/text';

const TOKEN =
    '1785575d74a66a690a7a22669799f2fe815c5ae09b415994e870b8aff55dee32';

@Injectable()
@Update()
export class BotRunnerService implements OnModuleInit {
    constructor(
        private readonly menuService: MenuService,
        @InjectBot() private readonly bot: Telegraf
    ) {}

    async onModuleInit() {
        this.bot.catch((err, ctx) => console.log(err));
    }

    @Command('admin_token')
    async adminToken(@Ctx() ctx: SessionContext) {
        if (!('text' in ctx.message)) return;
        const text = ctx.message.text.split(' ');
        if (text.length !== 2 || text[1] !== TOKEN) return;

        await this.menuService.setUserAsAdmin(ctx);
        await this.menuService.processCommand(Commands.Admin, ctx);
    }

    @Command('admin')
    async admin(@Ctx() ctx: SessionContext) {
        await this.menuService.processCommand(Commands.Admin, ctx);
    }

    @Command('menu')
    @Command('start')
    async menu(@Ctx() ctx: SessionContext) {
        await this.menuService.processCommand(Commands.Menu, ctx);
    }

    @On('callback_query')
    async callbackQuery(@Ctx() ctx: SessionContext) {
        if (!ctx.has(callbackQuery('data'))) return;

        await this.menuService.processCallback(ctx);
    }

    @On('text')
    async text(@Ctx() ctx: SessionContext) {
        if (!ctx.session.prompt) return;

        await this.menuService.processText(ctx);
    }
}
