import {Firestore} from '@google-cloud/firestore';
import {batchCreate, paginateQuery} from '@functions/repositories/helper';

/**
 * @documentation
 * Repository for notifications collection - handles only notifications collection operations
 */
const firestore = new Firestore();

/** @type CollectionReference */
const collection = firestore.collection('notifications');

/**
 * Creates a single notification document in Firestore
 * @param {Object} data - The notification data to create
 * @returns {Promise<string>} The ID of the created notification document
 */
export async function createOne(data) {
  const created = await collection.add(data);
  return created.id;
}

/**
 * Creates multiple notification documents in Firestore using batch operations
 * @param {Array<Object>} dataList - Array of notification data objects to create
 * @returns {Promise<void>} Resolves when all notifications are created
 */
export async function create(dataList) {
  await batchCreate({firestore: firestore, collection: collection, data: dataList});
}

/**
 * Retrieves notifications with pagination support
 * @param {Object} params - Query parameters
 * @param {string} params.shopId - The shop ID to filter notifications by
 * @param {string} [params.after] - Cursor for pagination (document ID to start after)
 * @param {string} [params.before] - Cursor for pagination (document ID to start before)
 * @param {number} [params.limit] - Maximum number of documents to return
 * @param {boolean} [params.withDocs] - Whether to include document data in response
 * @param {boolean} [params.hasCount] - Whether to include total count in response
 * @returns {Promise<Object>} Paginated notification results
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

/**
 * Retrieves all notifications for a specific shop domain
 * @param {string} shopDomain - The shop domain to filter notifications by
 * @returns {Promise<Array<Object>>} Array of notification documents for the domain
 */
export async function getByDomain(shopDomain) {
  const docs = await collection
    .where('shopDomain', '==', shopDomain)
    .orderBy('created_at', 'desc')
    .get();
  return docs.docs.map(doc => ({
    ...doc.data()
  }));
}
