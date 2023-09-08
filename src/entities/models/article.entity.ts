import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity()
export class Article extends BaseEntity<Article> {
    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    url: string;

    @ManyToOne(() => Product, (product) => product.articles, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ nullable: true })
    productId: number;
}
