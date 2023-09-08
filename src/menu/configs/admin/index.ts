import { AdminMainNode, AdminSubscribeSwitchHandler } from './root';
import {
    AdminCategoryCreateHandler,
    AdminCategoryCreateNode,
    AdminCategoryEditNameHandler,
    AdminCategoryEditNameNode,
    AdminCategoryListNode,
    AdminCategoryNode,
    AdminCategoryRemoveConfirmationNode,
    AdminCategoryRemoveHandler
} from './category';
import {
    AdminProductCreateHandler,
    AdminProductCreateNode,
    AdminProductEditPropHandler,
    AdminProductEditPropNode,
    AdminProductEnableSwitchHandler,
    AdminProductListNode,
    AdminProductNode,
    AdminProductRemoveConfirmationNode,
    AdminProductRemoveHandler
} from './product';
import {
    AdminArticleConnectProductHandler,
    AdminArticleConnectProductNode,
    AdminArticleCreateHandler,
    AdminArticleCreateNode,
    AdminArticleEditPropHandler,
    AdminArticleEditPropNode,
    AdminArticleListNode,
    AdminArticleNode,
    AdminArticleRemoveHandler
} from './article';

export const adminNodes = [
    AdminMainNode,

    AdminCategoryListNode,
    AdminCategoryNode,
    AdminCategoryCreateNode,
    AdminCategoryEditNameNode,
    AdminCategoryRemoveConfirmationNode,

    AdminProductListNode,
    AdminProductNode,
    AdminProductCreateNode,
    AdminProductEditPropNode,
    AdminProductRemoveConfirmationNode,

    AdminArticleListNode,
    AdminArticleNode,
    AdminArticleCreateNode,
    AdminArticleEditPropNode,
    AdminArticleConnectProductNode
];

export const adminHandlers = [
    AdminSubscribeSwitchHandler,

    AdminCategoryCreateHandler,
    AdminCategoryEditNameHandler,
    AdminCategoryRemoveHandler,

    AdminProductCreateHandler,
    AdminProductEditPropHandler,
    AdminProductRemoveHandler,
    AdminProductEnableSwitchHandler,

    AdminArticleCreateHandler,
    AdminArticleEditPropHandler,
    AdminArticleConnectProductHandler,
    AdminArticleRemoveHandler
];
