import {useState} from 'react';
import {api} from '@assets/helpers';
import {useStore} from '@assets/reducers/storeReducer';
import {setToast} from '@assets/actions/storeActions';
import {handleError} from '@assets/services/errorService';

/**
 * @param url
 * @param fullResp
 * @param successCallback
 * @returns {{deleting: boolean, handleDelete}}
 */
export default function useDeleteApi({url, fullResp = false, successCallback = () => {}}) {
  const {dispatch} = useStore();
  const [deleting, setDeleting] = useState(false);

  /**
   * @param data
   * @param id
   * @returns {Promise<boolean>}
   */
  const handleDelete = async ({data = {}, id = ''}) => {
    try {
      setDeleting(true);
      const resp = await api(id === '' ? url : `${url}/${id}`, {
        method: 'DELETE',
        body: data
      });
      if (resp.success) {
        setToast(dispatch, resp.message || 'Deleted successfully');
        successCallback(resp);
      }
      if (resp.error) {
        setToast(dispatch, resp.error, true);
      }
      return fullResp ? resp : resp.success;
    } catch (e) {
      handleError(e);
      setToast(dispatch, 'Failed to delete', true);
    } finally {
      setDeleting(false);
    }
  };

  return {deleting, handleDelete};
}
