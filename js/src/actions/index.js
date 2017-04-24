import axios from 'axios';

import { API, ACTIONS } from './constants';

export function fetchScans() {
  const request = axios.get(`${API}/api/scans/`);
  return {
    payload: request,
    type: ACTIONS.FETCH_SCANS,
  };
}

export function fetchTags(scanId) {
  const request = axios.get(`${API}/api/tags/${scanId}/`);
  return {
    payload: request,
    type: ACTIONS.FETCH_TAGS,
  };

}

export function toggleOdbc() {
  return {
    payload: null,
    type: ACTIONS.TOGGLE_ODBC,
  };
}

export function toggleFileUploader() {
  return {
    payload: null,
    type: ACTIONS.TOGGLE_FILE_UPLOADER,
  };
}
