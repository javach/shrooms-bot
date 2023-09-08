import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';

@Entity()
export class Category extends BaseEntity<Category> {
    @Column({ type: 'varchar', length: 32 })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
