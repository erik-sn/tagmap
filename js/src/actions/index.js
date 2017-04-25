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

export function fetchDatabases() {
  const request = axios.get(`${API}/api/databases/`);
  return {
    payload: request,
    type: ACTIONS.FETCH_DATABASES,
  };
}

export function toggleCreateOdbc() {
  return {
    payload: null,
    type: ACTIONS.TOGGLE_CREATE_ODBC,
  };
}

export function toggleScanOdbc() {
  return {
    payload: null,
    type: ACTIONS.TOGGLE_SCAN_ODBC,
  };
}

export function toggleFileUploader() {
  return {
    payload: null,
    type: ACTIONS.TOGGLE_FILE_UPLOADER,
  };
}
