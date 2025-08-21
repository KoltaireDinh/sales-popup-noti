import {api} from '@functions/helpers/api';
import cleanEmptyField from '@functions/helpers/utils/cleanEmptyField';
import qs from 'qs';

const BASE_URL = 'https://blog-admin.avada.io/articles';

/**
 * @param query
 * @returns {Promise<{data: any[], hasNext: boolean, hasPre: boolean, error}>}
 */
export async function getAppNewsList(query) {
  try {
    const {searchKey, categories} = query;
    const where = [categories && {categories}, searchKey && {title_contains: searchKey}].filter(
      Boolean
    );
    return await paginateStrapi({...query, where});
  } catch (e) {
    console.error(e);
    return {data: [], count: 0, hasPre: false, hasNext: true, error: e.message};
  }
}

async function paginateStrapi({
  where = [],
  sort = '',
  limit = 20,
  page = 1,
  total = 0,
  before = null,
  after = null,
  countTotal = false
}) {
  const $limit = parseInt(limit + '');
  const params = cleanEmptyField({
    _where: where.length > 0 && where,
    _sort: sort,
    _limit: $limit + 1,
    _start: (page - 1) * $limit
  });

  // if (countTotal) {
  //   const isCounted = (before || after) && total;
  //   if (isCounted) return {count: total};
  //   const count = await api(`${BASE_URL}/count?${qs.stringify(params)}`);
  //   return {count};
  // }

  const data = await api(`${BASE_URL}?${qs.stringify(params)}`);

  return {
    data: data.slice(0, $limit),
    hasPre: page > 1,
    hasNext: data.length > $limit
  };
}
