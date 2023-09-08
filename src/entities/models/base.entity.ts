import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity<T> {
    constructor(data: Partial<T>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn('increment')
    id: number;
}
