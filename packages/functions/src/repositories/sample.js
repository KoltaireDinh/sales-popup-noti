import {Firestore} from '@google-cloud/firestore';
import {formatDateFields} from '@avada/firestore-utils';

const firestore = new Firestore();

/**
 * @type CollectionReference
 * @documentation
 *
 * Only use one repository to connect to one collection, do not
 * try to connect more than one collection from one repository
 */
const collection = firestore.collection('sample');

/**
 * @param {string} id
 * @returns {Promise<*&{id}>}
 */
export async function getOne(id) {
  const doc = await collection.doc(id).get();
  return {id: doc.id, ...formatDateFields(doc.data())};
}

/**
 * @param {object} data
 * @returns {Promise<string>}
 */
export async function createOne(data) {
  const created = await collection.add({...data, createdAt: new Date()});
  return created.id;
}

/**
 * @param {string} id
 * @param {object} data
 * @returns {Promise<FirebaseFirestore.WriteResult>}
 */
export async function updateOne(id, data) {
  return collection.doc(id).update({...data, updatedAt: new Date()});
}

/**
 * @param {string} id
 * @return {Promise<FirebaseFirestore.WriteResult>}
 */
export async function deleteOne(id) {
  return collection.doc(id).delete();
}

/**
 * @param {string} shopId
 * @returns {Promise<any[]>}
 */
export async function getAll(shopId) {
  const docs = await collection.where('shopId', '==', shopId).get();
  return docs.docs.map(doc => ({id: doc.id, ...formatDateFields(doc.data())}));
}

/**
 * @param {string} shopId
 * @returns {Promise<*>}
 */
export async function getFirst(shopId) {
  const docs = await collection
    .where('shopId', '==', shopId)
    .limit(1)
    .get();
  if (docs.empty) {
    return null;
  }
  const doc = docs[0];

  return {id: doc.id, ...formatDateFields(doc.data())};
}
