import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CartEntry } from './cart-entry.entity';
import { Review } from './review.entity';

export enum USER_ROLE {
    DEFAULT = 'default',
    ADMIN = 'admin'
}

@Entity()
export class User extends BaseEntity<User> {
    @Column({ type: 'int' })
    telegramId: number;

    @Column({ type: 'int' })
    chatId: number;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'varchar', default: USER_ROLE.DEFAULT })
    role: USER_ROLE;

    @Column({ type: 'boolean', default: false })
    isSubscribed: boolean;

    @OneToMany(() => CartEntry, (cartEntry) => cartEntry.user)
    cartEntries: CartEntry[];

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];
}
