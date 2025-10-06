import {useEffect, useState} from 'react';
import useFetchApi from '@assets/hooks/api/useFetchApi';

/**
 * @param {string} url
 * @param defaultData
 * @param {boolean} initLoad
 * @param {boolean} keepPreviousData
 * @param presentData
 * @param defaultLimit
 * @param defaultSort
 * @param searchKey
 * @param initQueries
 * @param params
 * @returns {{pageInfo: {hasPre, hasNext}, data, setData, count, setCount, fetchApi, loading, fetched, prevPage, nextPage, onQueryChange, onQueriesChange, refetch}}
 */
export default function usePaginate({
  url,
  defaultData = [],
  initLoad = true,
  keepPreviousData = false,
  presentData = null,
  defaultLimit = 10,
  defaultSort = 'createdAt:asc',
  searchKey = 'searchKey',
  initQueries = {},
  params = {}
}) {
  const [queries, setQueries] = useState({
    page: 1,
    sort: defaultSort,
    limit: defaultLimit,
    [searchKey]: '',
    ...initQueries,
    ...params
  });

  const fetchApiHook = useFetchApi({
    url,
    defaultData,
    initLoad,
    presentData,
    initQueries: {...queries, ...params}
  });
  const {data, fetchApi} = fetchApiHook;

  // Refetch when params change
  useEffect(() => {
    if (Object.keys(params).length > 0) {
      setQueries(prev => ({...prev, ...params, page: 1}));
      handleFetchApi({...params, page: 1}, false);
    }
  }, [JSON.stringify(params)]);

  const handleFetchApi = async (extraParams = null, keepData = false) => {
    await fetchApi(url, {...queries, ...params, ...extraParams}, keepData);
  };

  const onQueryChange = (key, value, isFetch = false) => {
    setQueries(prev => ({...prev, [key]: value}));
    if (isFetch) handleFetchApi({[key]: value}).then();
  };

  const onQueriesChange = (newQueries, isFetch = false) => {
    setQueries(prev => ({...prev, ...newQueries}));
    if (isFetch) handleFetchApi(newQueries).then();
  };

  const onPaginate = async (paginate = '') => {
    const [before, after, page] = (() => {
      switch (paginate) {
        case 'prev':
          return [data[0].id, '', queries.page - 1];
        case 'next':
          return ['', data[data.length - 1].id, queries.page + 1];
        default:
          return ['', '', 1];
      }
    })();
    await handleFetchApi({page, before, after}, keepPreviousData);
    setQueries(prev => ({...prev, page}));
  };

  const refetch = async () => {
    await handleFetchApi(null, false);
  };

  return {
    prevPage: () => onPaginate('prev'),
    nextPage: () => onPaginate('next'),
    onQueryChange,
    onQueriesChange,
    refetch,
    ...fetchApiHook
  };
}
