import { Module } from '@nestjs/common';
import { BotRunnerModule } from './bot-runner/bot-runner.module';

@Module({
    imports: [BotRunnerModule]
})
export class AppModule {}
