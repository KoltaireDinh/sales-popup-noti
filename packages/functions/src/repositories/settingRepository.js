import {Firestore} from '@google-cloud/firestore';
import {formatDateFields} from '@avada/firestore-utils';

/**
 * @documentation
 * Repository for settings collection - handles only settings collection operations
 */
const firestore = new Firestore();

/** @type CollectionReference */
const collection = firestore.collection('settings');

/**
 * Retrieves a single settings document by ID with formatted date fields
 * @param {string} id - The settings document ID
 * @returns {Promise<Object|null>} The settings document data with formatted dates or null if not found
 */
export async function getOne(id) {
  const doc = await collection.doc(id).get();
  return {shopId: id, ...formatDateFields(doc.data())};
}
/**
 * Updates a settings document with new data and automatically sets updatedAt timestamp
 * @param {Object} shopData - The shop data object
 * @param data
 * @returns {Promise<WriteResult>} Firestore write result
 */
export async function updateOne(shopData, data) {
  return collection.doc(shopData.id).set({...data, updatedAt: new Date()}, {merge: true});
}

/**
 * create settings
 * @param data
 * @param shopId
 * @returns {Promise<string>}
 */
export async function createOne({data, shopId}) {
  try {
    const settingsDocRef = await collection.add({...data, shopId: shopId});
    console.log('Settings Document created with Id', settingsDocRef.id);
    return settingsDocRef.id;
  } catch (error) {
    console.error('Error when creating settings', error);
  }
}
