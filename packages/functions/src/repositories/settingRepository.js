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
  if (!doc.exists) {
    return null;
  }
  return {shopId: id, ...formatDateFields(doc.data())};
}

/**
 * get settings by domains
 * @param shopDomain
 * @returns {Promise<any>}
 */
export async function getOneByDomain(shopDomain) {
  try {
    const docs = await collection
      .where('shopDomain', '==', shopDomain)
      .limit(1)
      .get();

    if (docs.empty) {
      console.log(`No settings found for domain: ${shopDomain}`);
      return null;
    }

    const doc = docs.docs[0];
    const data = doc.data();

    console.log(`Settings found for domain: ${shopDomain}`);

    return {
      id: doc.id,
      shopDomain,
      ...formatDateFields(data),
    };

  } catch (error) {
    console.error(`Error fetching settings for domain ${shopDomain}:`, error);
    throw error;
  }
}
/**
 * Updates a settings document with new data and automatically sets updatedAt timestamp
 * @param {Object} shopData - The shop data object
 * @param data
 * @returns {Promise<WriteResult>} Firestore write result
 */
export async function updateOne(shopData, data) {
  console.log(shopData);
  return collection
    .doc(shopData.id)
    .set(
      {...data, shopDomain: shopData.shopifyDomain, shopId: shopData.id, updatedAt: new Date()},
      {merge: true}
    );
}
/**
 * create settings
 * @param data
 * @param shopId
 * @returns {Promise<string>}
 */
export async function createOne({data, shopData}) {
  try {
    const docRef = collection.doc(shopData.id);
    const settingsData = {
      ...data,
      shopId: shopData.id,
      shopDomain: shopData.shopDomain,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await docRef.set(settingsData);
    console.log(`Created settings with shop: ${shopData.id}`);
    return {id: shopData.id, ...settingsData};
  } catch (error) {
    console.error('Error when creating settings:', error);
  }
}
