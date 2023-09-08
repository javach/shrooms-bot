import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session, Telegraf } from 'telegraf';
import { BotRunnerService } from './services';
import { MenuModule } from '../menu/menu.module';
import { config } from '../utils/config';

@Module({
    imports: [
        MenuModule,
        TelegrafModule.forRoot({
            token: config.bot_token,
            middlewares: [session(), Telegraf.log()]
        })
    ],
    providers: [BotRunnerService]
})
export class BotRunnerModule {}
