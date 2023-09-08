import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './models';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            synchronize: true,
            database: `${process.cwd()}/db.sqlite`,
            entities
        }),
        TypeOrmModule.forFeature(entities)
    ],
    exports: [TypeOrmModule.forFeature(entities)]
})
export class EntitiesModule {}
