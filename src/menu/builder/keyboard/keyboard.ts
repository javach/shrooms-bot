import { InlineKeyboardMarkup } from 'telegraf/types';
import { KeyboardButton, MoveButton } from './keyboard-button';
import { Text } from '../../text';
import { MenuNode } from '../nodes';

export class Keyboard {
    constructor(private readonly buttons: KeyboardButton<any>[][] = []) {}

    encode(): InlineKeyboardMarkup {
        return {
            inline_keyboard: this.buttons.map((buttons) =>
                buttons.map((button) => button.encode())
            )
        };
    }

    addRow(button: KeyboardButton<any> | KeyboardButton<any>[]): this {
        this.buttons.push(Array.isArray(button) ? button : [button]);
        return this;
    }

    addBackButton<TParams>(node: {
        type: typeof MenuNode<TParams>;
        params?: TParams;
    }): this {
        this.addRow(
            new MoveButton({
                text: Text.General.Buttons.back(),
                node
            })
        );
        return this;
    }

    splitAndAddRows(buttons: KeyboardButton<any>[], rowLimit: number): this {
        for (let i = 0; i < buttons.length; i += rowLimit) {
            this.addRow(buttons.slice(i, i + rowLimit));
        }
        return this;
    }

    generatePagedListButtons<TEntity>(options: {
        entities: TEntity[];
        getEntityButton: (entity: TEntity) => KeyboardButton<any>;
        getPageControlButton: (
            text: string,
            page: number
        ) => KeyboardButton<any>;
        page: number;
        maxPage: number;
        rowLimit?: number;
    }): this {
        const buttons = options.entities.map((e) => options.getEntityButton(e));
        this.splitAndAddRows(buttons, options.rowLimit || 2);

        this.generatePageControlButtons(options);

        return this;
    }

    generatePageControlButtons(options: {
        maxPage: number;
        page: number;
        getPageControlButton: (
            text: string,
            page: number
        ) => KeyboardButton<any>;
    }): this {
        const controls = [];
        if (options.page > 0) {
            controls.push(
                options.getPageControlButton(
                    Text.General.Buttons.prevPage(),
                    options.page - 1
                )
            );
        }
        if (options.page < options.maxPage) {
            controls.push(
                options.getPageControlButton(
                    Text.General.Buttons.nextPage(),
                    options.page + 1
                )
            );
        }

        this.addRow(controls);
        return this;
    }
}
