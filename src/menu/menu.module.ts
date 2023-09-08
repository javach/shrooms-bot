import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import { MenuService, ProviderService } from './services';

@Module({
    imports: [EntitiesModule],
    providers: [MenuService, ProviderService],
    exports: [MenuService]
})
export class MenuModule {}
