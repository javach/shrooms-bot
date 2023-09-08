import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class CartEntry extends BaseEntity<CartEntry> {
    @ManyToOne(() => Product, (product) => product.cartEntries, {
        nullable: false
    })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;

    @ManyToOne(() => User, (user) => user.cartEntries, {
        nullable: false
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @Column({ type: 'integer', nullable: false })
    quantity: number;
}
