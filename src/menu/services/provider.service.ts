import { Injectable } from '@nestjs/common';
import { Handler, MenuNode, MoveHandler } from '../builder';
import {
    Article,
    CartEntry,
    Category,
    Product,
    Review,
    User
} from '../../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Context } from 'telegraf';
import { adminHandlers, adminNodes } from '../configs/admin';
import { Commands } from '../text';
import { userHandlers, userNodes } from '../configs/user';

@Injectable()
export class ProviderService {
    private nodeRegistry = new Map<string, typeof MenuNode<any>>();
    private handlerRegistry = new Map<string, typeof Handler<any>>();
    private commandRegistry = new Map<string, typeof MenuNode<any>>();

    private addNodesAndHandlers(
        start: number,
        nodes: (typeof MenuNode<any>)[],
        handlers: (typeof Handler<any>)[]
    ) {
        let idCounter = start;
        nodes.forEach((node) => {
            node.attachId(String(idCounter++));
            this.nodeRegistry.set(node.id, node);
            if (node.entryCommand) {
                this.commandRegistry.set(node.entryCommand, node);
            }
        });
        idCounter = start;
        handlers.forEach((handler) => {
            handler.attachId(String(idCounter++));
            this.handlerRegistry.set(handler.id, handler);
        });
    }

    constructor(
        @InjectRepository(User) readonly userRepository: Repository<User>,
        @InjectRepository(Product)
        readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        readonly categoryRepository: Repository<Category>,
        @InjectRepository(CartEntry)
        readonly cartEntryRepository: Repository<CartEntry>,
        @InjectRepository(Article)
        readonly articleRepository: Repository<Article>,
        @InjectRepository(Review)
        readonly reviewRepository: Repository<Review>
    ) {
        this.addNodesAndHandlers(0, [], [MoveHandler]);
        this.addNodesAndHandlers(10, adminNodes, adminHandlers);
        this.addNodesAndHandlers(200, userNodes, userHandlers);
    }

    getNodeByCommand(command: Commands) {
        return this.commandRegistry.get(command);
    }

    getNode(id: string) {
        return this.nodeRegistry.get(id);
    }

    getHandler(id: string) {
        return this.handlerRegistry.get(id);
    }

    async getUser(ctx: Context): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { telegramId: ctx.from.id }
        });
        if (user) return user;
        return this.userRepository.save({
            telegramId: ctx.from.id,
            chatId: ctx.message.chat?.id || ctx.callbackQuery?.message?.chat.id
        });
    }
}
