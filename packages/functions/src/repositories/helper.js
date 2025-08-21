import {chunk, flatten} from '@avada/utils';
import {formatDateFields} from '@avada/firestore-utils';
import {FieldPath} from '@google-cloud/firestore/build/src';

const BATCH_SIZE = 500;

/**
 * @param {DocumentSnapshot|*} doc
 * @param {*} data
 * @param {string} keyId
 * @returns {*}
 */
export function prepareDoc({doc, data = {}, keyId = 'id'}) {
  if (doc) {
    data = typeof doc.data() === 'undefined' ? {} : {...doc.data(), [keyId]: doc.id};
  }
  return formatDateFields(data);
}

/**
 * @param queriedRef
 * @param collection
 * @param query
 * @param limit
 * @returns {Promise<{data: *[], total?: number, pageInfo: {hasNext: boolean, hasPre: boolean, totalPage?: number}}>}
 */
export async function paginateQuery({
  queriedRef,
  collection,
  query,
  defaultLimit = query.limit,
  pickedFields = []
}) {
  const limit = parseInt(defaultLimit || '20');
  let total;
  let totalPage;
  if (query.hasCount) {
    total = (await queriedRef.count().get()).data().count;
    totalPage = Math.ceil(total / limit);
  }

  const getAll = query.getAll || !limit;
  let hasPre = false;
  let hasNext = false;

  if (pickedFields.length) queriedRef = queriedRef.select(...pickedFields);
  if (!getAll) {
    if (query.after) {
      const after = await collection.doc(query.after).get();
      queriedRef = queriedRef.startAfter(after);

      hasPre = true;
    }
    if (query.before) {
      const before = await collection.doc(query.before).get();
      queriedRef = queriedRef.endBefore(before).limitToLast(limit);

      hasNext = true;
    } else {
      queriedRef = queriedRef.limit(limit);
    }
  }

  const docs = await queriedRef.get();

  const data = docs.docs.map(doc => prepareDoc({doc}));

  if (!getAll && (!hasPre || !hasNext)) {
    const [resultHasPre, resultHasNext] = await Promise.all([
      verifyHasPre(docs, queriedRef),
      verifyHasNext(docs, queriedRef)
    ]);
    if (!hasPre) {
      hasPre = resultHasPre;
    }
    if (!hasNext) {
      hasNext = resultHasNext;
    }
  }

  const resp = {data, count: docs.size, total, pageInfo: {hasPre, hasNext, totalPage}};
  return query.withDocs ? {...resp, docs} : resp;
}

/**
 *
 * @param objectDocs
 * @param queriedRef
 * @returns {Promise<boolean>}
 */
export async function verifyHasPre(objectDocs, queriedRef) {
  if (objectDocs.size === 0) {
    return false;
  }

  const preRef = await queriedRef
    .endBefore(objectDocs.docs[0])
    .limit(1)
    .get();

  return preRef.size > 0;
}

/**
 *
 * @param objectDocs
 * @param queriedRef
 * @returns {Promise<boolean>}
 */
export async function verifyHasNext(objectDocs, queriedRef) {
  if (objectDocs.size === 0) {
    return false;
  }

  const nextRef = await queriedRef
    .startAfter(objectDocs.docs[objectDocs.size - 1])
    .limitToLast(1)
    .get();

  return nextRef.size > 0;
}

/**
 *
 * @param sortType
 * @returns {{sortField: *, direction: *}}
 */
export function getOrderBy(sortType) {
  const [sortField, direction] = sortType ? sortType.split('_') : ['updatedAt', 'desc'];
  return {sortField, direction};
}

/**
 * @param {CollectionReference} collection
 * @param {Object} filters
 * @param {boolean} cleanEmptyFilter
 * @returns {Query}
 */
function prepareQueryRef({collection, filters = {}, cleanEmptyFilter = true}) {
  return Object.keys(filters).reduce((query, field) => {
    const val = filters[field];
    if (cleanEmptyFilter && !val) {
      return query;
    }
    if (isObject(val) && ['operator', 'value'].every(key => val.hasOwnProperty(key))) {
      const {operator, value} = val;
      return query.where(field, operator, value);
    }
    return query.where(field, '==', val);
  }, collection);
}

/**
 * Get list from firebase depends on ID array
 *
 * @param {CollectionReference} collection
 * @param {[]} ids
 * @param {string} idField
 * @param {Object} filters
 * @param {string[]} selectFields
 * @param {boolean} selectDoc
 * @returns {Promise<*[]>}
 */
export async function getByIds({
  collection,
  ids,
  idField = 'id',
  filters = {},
  selectFields = [],
  selectDoc = false
}) {
  try {
    const idWhere = idField === 'id' ? FieldPath.documentId() : idField;
    const queriedRef = idBatch => {
      const query = prepareQueryRef({collection, filters}).where(idWhere, 'in', idBatch);
      return selectFields.length ? query.select(...selectFields) : query;
    };

    const batches = chunk(ids, 10);
    const rawDocs = await Promise.all(batches.map(batch => queriedRef(batch).get()));
    const allDocs = flatten(rawDocs.map(docs => docs.docs));

    return selectDoc ? allDocs : allDocs.map(doc => prepareDoc({doc}));
  } catch (e) {
    console.error(e);
    return [];
  }
}

function isObject(obj) {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}

/**
 * @param {FirebaseFirestore.Firestore} firestore
 * @param {CollectionReference} collection
 * @param {*[]} data
 * @param {Function} callbackFunc callback function when batch create
 * @return {Promise<void>}
 */
export async function batchCreate({firestore, collection, data, callbackFunc = async () => {}}) {
  const batches = [];
  const dataChunks = chunk(data, BATCH_SIZE);
  dataChunks.forEach(dataChunk => {
    const batch = firestore.batch();
    dataChunk.forEach(dataItem => {
      batch.create(collection.doc(), dataItem);
    });
    batches.push({batch, size: dataChunk.length});
  });
  for (const {batch} of batches) {
    await batch.commit();
    await callbackFunc();
  }
}

/**
 * @param {FirebaseFirestore.Firestore} firestore
 * @param {FirebaseFirestore.QueryDocumentSnapshot[]} docs
 * @param {*} updateData
 * @return {Promise<void>}
 */
export async function batchUpdate(firestore, docs, updateData) {
  const batches = [];
  const docChunks = chunk(docs, BATCH_SIZE);
  docChunks.forEach(docChunk => {
    const batch = firestore.batch();
    docChunk.forEach(doc => {
      batch.update(doc.ref, updateData);
    });
    batches.push(batch);
  });
  for (const batch of batches) {
    await batch.commit();
  }
}

/**
 * @param {FirebaseFirestore.Firestore} firestore
 * @param {CollectionReference} collection
 * @param {*[]} data
 * @param {Function} callbackFunc callback function when batch update
 * @return {Promise<void>}
 */
export async function batchUpdateSeparateData({
  firestore,
  collection,
  data,
  callbackFunc = async () => {}
}) {
  const batches = [];
  const docChunks = chunk(data, BATCH_SIZE);
  docChunks.forEach(docChunk => {
    const batch = firestore.batch();
    docChunk.forEach(dataItem => {
      const {id, ...updateData} = dataItem;
      if (!id) return;
      batch.update(collection.doc(id), updateData);
    });
    batches.push({batch, size: docChunk.length});
  });
  for (const {batch} of batches) {
    await batch.commit();
    await callbackFunc();
  }
}

/**
 * @param {FirebaseFirestore.Firestore} firestore
 * @param {FirebaseFirestore.QueryDocumentSnapshot[]} docs
 * @return {Promise<void>}
 */
export async function batchDelete(firestore, docs) {
  const batches = [];
  const docChunks = chunk(docs, BATCH_SIZE);
  docChunks.forEach(docChunk => {
    const batch = firestore.batch();
    docChunk.forEach(doc => {
      batch.delete(doc.ref);
    });
    batches.push(batch);
  });
  for (const batch of batches) {
    await batch.commit();
  }
}

/**
 *
 * @param {CollectionReference} collection
 * @param {string} shopId
 * @param {number} perPage
 * @param {*} lastDoc
 * @param data
 * @returns {Promise<any[]>}
 */
export async function getDocsInChunks({
  collection,
  shopId,
  perPage = 1000,
  lastDoc = null,
  data = []
}) {
  let query = collection.where('shopId', '==', shopId).limit(perPage);
  if (lastDoc) query = query.startAfter(lastDoc);

  const snapshot = await query.get();
  const docs = snapshot.docs;
  data.push(...docs.map(doc => ({...formatDateFields(doc.data()), id: doc.id})));

  if (docs.length < perPage) return data;

  lastDoc = docs[docs.length - 1];
  return await getDocsInChunks({collection, shopId, lastDoc, data});
}
