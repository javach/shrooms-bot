import { MenuNode } from './menu-node';
import { FindManyOptions, Repository } from 'typeorm';

type PagedList<TEntity> = {
    entities: TEntity[];
    startIndex: number;
    total: number;
    page: number;
    hasPrev: boolean;
    hasNext: boolean;
    maxPage: number;
};

export abstract class EntityPagedListNode<
    TEntity,
    TParams = Record<string, never>
> extends MenuNode<
    TParams extends Record<string, never>
        ? { page: number }
        : { page: number } & TParams
> {
    protected abstract limit: number;

    protected getQuery(queryParams?: any): FindManyOptions<TEntity> {
        return {};
    }

    protected abstract getRepository(): Repository<TEntity>;

    protected async getPagedEntities(
        queryParams?: any
    ): Promise<PagedList<TEntity>> {
        const entities = await this.getRepository().find({
            ...this.getQuery(queryParams),
            take: this.limit,
            skip: this.limit * this.params.page
        });
        const total = await this.getRepository().count(
            this.getQuery(queryParams)
        );
        const maxPage = Number(Math.ceil(total / this.limit).toFixed(0)) - 1;

        return {
            entities,
            total,
            page: this.params.page,
            startIndex: this.limit * this.params.page,
            hasPrev: this.params.page > 0,
            hasNext: this.params.page < maxPage,
            maxPage
        };
    }
}
