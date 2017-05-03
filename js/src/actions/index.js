import axios from 'axios';

import { API, ACTIONS } from './constants';

/**
 * fetch all scans from the API
 * @returns Action
 */
export function fetchScans() {
  const request = axios.get(`${API}/api/scans/`);
  return {
    payload: request,
    type: ACTIONS.FETCH_SCANS,
  };
}

/**
 * fetch all tags that have a specific scan as a
 * parent
 * @returns Action
 */
export function fetchTags(scanId) {
  const request = axios.get(`${API}/api/tags/${scanId}/`);
  return {
    payload: request,
    type: ACTIONS.FETCH_TAGS,
    meta: {
      scanId,
    },
  };
}

/**
 * fetch all databases from the API
 * @returns Action
 */
export function fetchDatabases() {
  const request = axios.get(`${API}/api/databases/`);
  return {
    payload: request,
    type: ACTIONS.FETCH_DATABASES,
  };
}

/**
 * toggle the modal for Creating ODBC
 * @returns Action
 */
export function toggleCreateOdbc() {
  return {
    payload: null,
    type: ACTIONS.TOGGLE_CREATE_ODBC,
  };
}

/**
 * toggle the modal for Scanning ODBC
 * @returns Action
 */
export function toggleScanOdbc() {
  return {
    payload: null,
    type: ACTIONS.TOGGLE_SCAN_ODBC,
  };
}

/**
 * toggle the modal for the File Uploader
 * @returns Action
 */
export function toggleFileUploader() {
  return {
    payload: null,
    type: ACTIONS.TOGGLE_FILE_UPLOADER,
  };
}
