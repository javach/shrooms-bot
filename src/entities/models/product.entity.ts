import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { BaseEntity } from './base.entity';
import { CartEntry } from './cart-entry.entity';
import { Article } from './article.entity';
import { Review } from './review.entity';

@Entity()
export class Product extends BaseEntity<Product> {
    @Column({ type: 'varchar', length: 32, nullable: false })
    name: string;

    @Column({ type: 'text', default: '' })
    description: string;

    @Column({ type: 'boolean', default: true })
    isEnabled: boolean;

    @Column({ type: 'varchar', length: 16, nullable: false, default: '10 г' })
    weightPerPackage: string;

    @ManyToOne(() => Category, (category) => category.products, {
        nullable: false
    })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: number;

    @OneToMany(() => CartEntry, (cartEntry) => cartEntry.product)
    cartEntries: CartEntry[];

    @OneToMany(() => Article, (article) => article.product)
    articles: Article[];

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];
}
