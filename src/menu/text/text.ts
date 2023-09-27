import {
    Article,
    CartEntry,
    Category,
    Product,
    Review,
    User
} from '../../entities';
import { ProductEditProp } from '../configs/admin/product';
import { ArticleEditProp } from '../configs/admin/article';

export const Text = {
    Admin: {
        Nodes: {
            main: (isSubscribed: boolean) =>
                `<b>Админская панель</b>

Здесь вы можете подписаться на новые заказы, добавить и изменить категории и товары.

<b>Статус подписки на заказы:</b> Вы ${
                    isSubscribed ? 'будете' : 'не будете'
                } получать уведомления о новых заказах.`,

            categoryList: () => `<b>Управление категориями</b>

Выберите одну из категорий для изменения или создайте новую.`,

            categoryDetail: (category: Category, productCount: number) =>
                `<b>Категория ${category.name}</b>

Количество товаров в категории: ${productCount}.`,

            categoryEditName: () => 'Введите новое название для категории.',

            categoryCreate: () => 'Введите название новой категории.',

            categoryRemoveConfirm: (category: Category) =>
                `В категории <b>${category.name}</b> есть товары. При удалении категории удаляются все товары категории.
Вы действительно хотите удалить категорию?`,

            productList: (
                category: Category
            ) => `<b>Управление товарами категории ${category.name}</b>

Выберите один из товаров для изменения или создайте новый.`,

            productDetail: (product: Product) => `<b>Товар ${product.name}</b>

Доступен для заказа: ${product.isEnabled ? 'да' : 'нет'}
Упакока: ${product.weightPerPackage}
Описание: <i>${product.description}</i>`,

            productCreate: () => 'Введите название нового товара.',

            productEditProp: (prop: ProductEditProp) => {
                const propString =
                    prop === ProductEditProp.Name
                        ? 'название'
                        : prop === ProductEditProp.Description
                        ? 'описание'
                        : 'наименование/вес упаковки (например, <i>10 г</i>, <i>банка</i>)';
                return `Введите новое ${propString} товара.`;
            },

            productRemoveConfirm: () => 'Подтвердите удаление товара.',

            articleList: (page: number, maxPage: number) => {
                const pageCounter =
                    maxPage > 0
                        ? ` (страница ${page + 1} из ${maxPage + 1})`
                        : '';
                return `<b>Список статей</b>${pageCounter}

Выберите одну из статей ниже для изменения или создайте новую`;
            },

            articleDetail: (article: Article) => {
                const formatted = article.url
                    ? `<a href='${article.url}'>${article.name}</a>`
                    : 'для отображение в списке статей укажите ссылку!';
                return `<b>Изменение статьи</b>

Название: ${article.name}
Ссылка: ${article.url || 'не указана'}
Отображение: ${formatted}
Привязанный продукт: ${
                    article.product
                        ? article.product.name
                        : 'не привязана (в общем списке)'
                }`;
            },

            articleCreate: () => 'Введите названия новой статьи.',

            articleConnect: () => `<b>Привязка продукта к статье</b>

Выберите продукт из списка ниже, чтобы привязать его к статье, либо отвяжите продукт.`,

            articleEditProp: (prop: ArticleEditProp) => {
                const propString =
                    prop === ArticleEditProp.Name
                        ? 'новое название'
                        : 'новую ссылку';
                return `Введите ${propString} для статьи.`;
            }
        },
        Buttons: {
            categoryCreate: () => 'Создать новую категорию',

            toCategoryList: () => 'Категории',

            subscribe: (isSubscribed: boolean) =>
                !isSubscribed
                    ? 'Подписаться на заказы'
                    : 'Отписаться от заказов',

            editName: () => 'Изменить название',

            editDescription: () => 'Изменить описание',

            editWeightPerPackage: () => 'Изменить упаковку',

            editUrl: () => 'Изменить ссылку',

            switch: (isEnabled: boolean) =>
                isEnabled ? 'Отключить' : 'Включить',

            toProductList: () => 'Товары',

            productCreate: () => 'Создать новый товар',

            toArticleList: () => 'Статьи',

            articleCreate: () => 'Создать новую статью',

            articleEditProduct: (hasProduct: boolean) =>
                hasProduct
                    ? 'Изменить привязку к продукту'
                    : 'Привязать к продукту',

            articleDisconnectProduct: () => 'Отвязать',

            remove: () => 'Удалить'
        },
        Callback: {
            subscribeSwitched: (isSubscribed: boolean) =>
                isSubscribed
                    ? 'Вы успешно подписаны на увдомления о заказах'
                    : 'Вы успешно отписаны от уведомлений о заказах',

            promptLengthError: (maxLength: number) =>
                `Значение не должно содержать более ${maxLength} символов.`,

            categoryRemoved: () => 'Категория успешно удалена',

            productRemoved: () => 'Товар успешно удалён',

            productEnableSwitched: (isEnabled: boolean) =>
                `Товар теперь ${
                    isEnabled ? 'доступен' : 'недоступен'
                } для заказа`,

            productDontExist: () => 'Такого товара не существует',

            articleRemoved: () => 'Статья успешно удалена'
        }
    },

    User: {
        Nodes: {
            main: (user: User) => `Привет!

Адрес доставки: ${user.address || 'не указан'}`,

            editAddress: () => 'Введите адрес доставки.',

            contacts: () => 'Для связи с менеджером напишите @chervycola.',

            catalogue: () => `<b>Каталог</b>

Используйие кнопки ниже для выбора категории.`,

            catalogueCategory: (
                category: Category
            ) => `<b>Каталог: ${category.name}</b>

Используйте кнопки ниже для выбора товара.`,

            catalogueProduct: (product: Product) =>
                `<b>Каталог: ${product.name}</b>${
                    !product.isEnabled ? ' (товар недоступен!)' : ''
                }

Упаковка: ${product.weightPerPackage}

Описание: <i>${product.description}</i>`,

            cart: (user: User, entries: CartEntry[]) => {
                if (!entries.length)
                    return `<b>Корзина</b>\n\nВаша корзина пуста.`;
                const entriesList = entries.map(
                    (entry) =>
                        `• ${entry.product.name} ${entry.quantity} x ${entry.product.weightPerPackage}`
                );
                return `<b>Корзина</b>

${entriesList.join('\n')}

${!user.address ? 'Для продолжения заказ укажите адрес доставки' : ''}`;
            },

            cartEdit: () => `<b>Корзина</b>

Выберите позицию для изменения`,

            productAdd: (product: Product, cartEntry: CartEntry) =>
                `Вы добавили товар <b>${product.name}</b> в количестве <b>${cartEntry.quantity} x ${cartEntry.product.weightPerPackage}</b> в корзину. 

Вы можете изменить количество добавляемого товара, отправив в ответном сообщение желаемое количество (${product.weightPerPackage}).`,

            productAddSuccess: (cartEntry: CartEntry) =>
                `Вы добавили товар <b>${cartEntry.product.name}</b> в количестве <b>${cartEntry.quantity} x ${cartEntry.product.weightPerPackage}</b> в корзину.`,

            cartEntryEdit: (
                cartEntry: CartEntry
            ) => `Вы редактируете товар <b>${cartEntry.product.name}</b> в корзине.

Текущее количество: <b>${cartEntry.quantity} x ${cartEntry.product.weightPerPackage}</b>
Отправьте желаемое количество в ответном сообщении или удалите товар, используя кнопки ниже.`,

            articleProductList: (hasArticles: boolean) => `<b>Статьи</b>

${
    hasArticles ? 'Выберите раздел.' : 'К сожалению, этот раздел пока что пуст.'
}`,

            articles: (product: Product, articles: Article[]) => {
                const articleList = articles.map(
                    (article) =>
                        `• <a href='${article.url}'>${article.name}</a>`
                );
                return `<b>Статьи в разделе ${product?.name || 'Общее'}</b>

${articleList.join('\n')}`;
            },

            reviews: (
                product: Product,
                reviews: Review[],
                page: number,
                maxPage: number
            ) => {
                const reviewList =
                    reviews.length > 0
                        ? reviews
                              .map(
                                  (review) =>
                                      `• Аноним: <i>«${review.text}»</i>`
                              )
                              .join('\n\n')
                        : 'На данный товар ещё нет отзывов.';

                const pageCounter =
                    maxPage > 0
                        ? ` (страница ${page + 1} из ${maxPage + 1})`
                        : '';

                return `<b>Отзывы на товар ${product.name}${pageCounter}</b>

${reviewList}`;
            },

            reviewAdd(product: Product) {
                return `Вы собираетесь написать отзыв на товар <b>${product.name}</b>.

Отправьте текст отзыва в ответном сообщении.`;
            },

            reviewAddSuccess: () => 'Ваш отзыв сохранён.'
        },
        Buttons: {
            editAddress: (user: User) =>
                user.address
                    ? 'Изменить адрес доставки'
                    : 'Указать дрес доставки',

            catalogue: () => 'Каталог',

            articles: () => 'Статьи',

            toContacts: () => 'Связаться с менеджером',

            cart: () => 'Корзина',

            reviews: () => 'Отзывы',

            addReview: () => 'Оставить отзыв',

            addToCart: () => 'Добавить в корзину',

            removeFromCart: () => 'Удалить из корзины',

            toCart: () => `Перейти в корзину`,

            toContinue: () => 'Продолжить покупки',

            editCart: () => 'Изменить товары в корзине',

            confirmOrder: () => 'Подтвердить заказ',

            toMainMenu: () => 'В главное меню',

            cancel: () => 'Отмена'
        },
        Callback: {
            addressEdited: () => 'Адрес доставки успешно изменен.',

            cartEntryRemoved: () => 'Товар удалён из корзины',

            errorNotANumber: () => 'Пожалуйста, введите корректное число.',

            errorNonPositiveNumber: () =>
                'Пожалуйста, введите положительное число.'
        },
        Other: {
            entriesList: (entries: CartEntry[]) =>
                entries
                    .map(
                        (entry) =>
                            `• ${entry.product.name}, ${entry.quantity} x ${entry.product.weightPerPackage}`
                    )
                    .join('\n'),

            orderNotify: (
                user: User,
                entries: CartEntry[],
                username: string
            ) => `<b>Новый заказ от пользователя ${
                username ? '@' + username : '(юзернейм не указан)'
            }</b>

Адрес доставки: ${user.address}

${Text.User.Other.entriesList(entries)}`,

            orderConfirm: (
                user: User,
                entries: CartEntry[],
                username: string
            ) =>
                `<b>Ваш заказ</b>

Адрес доставки: ${user.address}

${Text.User.Other.entriesList(entries)}

${
    username
        ? 'В ближайшее время с вами свяжется менеджер для подтверждения заказа'
        : 'Так как у вас не указан юзернейм в Телеграм или он скрыт, менеджер не сможет с вами связаться самостоятельно. Для продолжения заказа перешлите данное сообщение менеджеру @chervycola'
}`
        }
    },

    General: {
        Buttons: {
            category: (category: Category) => category.name,

            product: (product: Product) => product.name,

            article: (article: Article) => article.name,

            cartEntry: (entry: CartEntry) =>
                `${entry.product.name} ${entry.quantity} x ${entry.product.weightPerPackage}`,

            nextPage: () => '»',

            prevPage: () => '«',

            common: () => 'Общие',

            back: () => 'Назад'
        },
        Nodes: {}
    }
};
