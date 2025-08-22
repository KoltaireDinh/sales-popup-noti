import {Firestore} from '@google-cloud/firestore';
import {batchCreate, paginateQuery} from '@functions/repositories/helper';

const firestore = new Firestore();

/**
 * @type CollectionReference
 * @documentation
 *
 * Only use one repository to connect to one collection, do not
 * try to connect more than one collection from one repository
 */
const collection = firestore.collection('notifications');

/**
 * @param dataList
 * @returns {Promise<void>}
 */
export async function create(dataList) {
  await batchCreate({firestore: firestore, collection: collection, data: dataList});
}

/**
 * @param shopId
 * @param after
 * @param before
 * @param limit
 * @param withDocs
 * @param hasCount
 * @returns {Promise<{data: *[], total?: number, pageInfo: {hasNext: boolean, hasPre: boolean, totalPage?: number}}>}
 */
export async function get({shopId, after, before, limit = 10, withDocs, hasCount}) {
  let queriedRef = collection;
  queriedRef = queriedRef.where('shopId', '==', shopId);
  queriedRef = queriedRef.orderBy('createdAt', 'desc');

  return await paginateQuery({
    queriedRef,
    collection,
    query: {after, before, limit, withDocs, hasCount}
  });
}
