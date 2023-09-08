import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Review extends BaseEntity<Review> {
    @Column('text')
    text: string;

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Product, (product) => product.reviews, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;
}
