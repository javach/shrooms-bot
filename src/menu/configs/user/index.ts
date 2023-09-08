import {
    UserContactsNode,
    UserEditAddressHandler,
    UserEditAddressNode,
    UserMainNode
} from './root';
import {
    UserCatalogueCategoryNode,
    UserCatalogueNode,
    UserCatalogueProductNode
} from './catalogue';
import {
    UserCartAddProductHandler,
    UserCartAddProductNode,
    UserCartAddProductSuccessNode,
    UserCartConfirmOrderNode,
    UserCartEditAddressHandler,
    UserCartEditAddressNode,
    UserCartEditCartEntryHandler,
    UserCartEditCartEntryNode,
    UserCartEditProductsNode,
    UserCartNode,
    UserCartRemoveCartEntryHandler
} from './cart';
import {
    UserArticleByProductListNode,
    UserArticleByProductNode
} from './article';
import {
    UserProductReviewAddHandler,
    UserProductReviewAddNode,
    UserProductReviewAddSuccessNode,
    UserProductReviewListNode
} from './review';

export const userNodes = [
    UserMainNode,
    UserEditAddressNode,

    UserCatalogueNode,
    UserCatalogueCategoryNode,
    UserCatalogueProductNode,

    UserCartNode,
    UserCartEditAddressNode,
    UserCartEditProductsNode,
    UserCartEditCartEntryNode,
    UserCartAddProductNode,
    UserCartAddProductSuccessNode,
    UserCartConfirmOrderNode,

    UserArticleByProductListNode,
    UserArticleByProductNode,

    UserProductReviewListNode,
    UserProductReviewAddNode,
    UserProductReviewAddSuccessNode,

    UserContactsNode
];

export const userHandlers = [
    UserEditAddressHandler,

    UserCartAddProductHandler,
    UserCartEditCartEntryHandler,
    UserCartRemoveCartEntryHandler,
    UserCartEditAddressHandler,

    UserProductReviewAddHandler
];
