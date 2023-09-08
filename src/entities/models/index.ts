import { Category } from './category.entity';
import { Product } from './product.entity';
import { User } from './user.entity';
import { CartEntry } from './cart-entry.entity';
import { Article } from './article.entity';
import { Review } from './review.entity';

export * from './category.entity';
export * from './product.entity';
export * from './user.entity';
export * from './cart-entry.entity';
export * from './article.entity';
export * from './review.entity';

export const entities = [Category, Product, User, CartEntry, Article, Review];
