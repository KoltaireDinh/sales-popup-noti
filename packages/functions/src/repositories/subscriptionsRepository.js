import {Firestore} from '@google-cloud/firestore';
import {getOrderBy, paginateQuery} from '@functions/repositories/helper';

const firestore = new Firestore();
/** @type {CollectionReference} */
const collection = firestore.collection('subscriptions');

/**
 * @param shopId
 * @param query
 * @returns {Promise<{data: *[], total?: number, pageInfo: {hasNext: boolean, hasPre: boolean, totalPage?: number}}>}
 */
export async function getSubscriptions(shopId, query = {}) {
  const {sortField, direction} = getOrderBy(query.sort);

  const queriedRef = collection.where('shopId', '==', shopId).orderBy(sortField, direction);

  return paginateQuery({queriedRef, collection, query});
}

/**
 * @param shopId
 * @param data
 * @returns {Promise<string>}
 */
export async function addSubscription(shopId, data) {
  const created = await collection.add({
    ...data,
    shopId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return created.id;
}

/**
 * @param id
 * @param data
 * @returns {Promise<void>}
 */
export async function updateSubscription(id, data) {
  await collection.doc(id).update({
    ...data,
    updatedAt: new Date()
  });
}

/**
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteSubscription(id) {
  await collection.doc(id).delete();
}
