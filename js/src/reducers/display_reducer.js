import { ACTIONS } from '../actions/constants';


const defaultModalStates = {
  showCreateOdbc: false,
  showScanOdbc: false,
  showFileUploader: false,
};

export const initialState = {
  ...defaultModalStates,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_CREATE_ODBC:
      return {
        ...state,
        ...defaultModalStates,
        showCreateOdbc: !state.showCreateOdbc,
      };
    case ACTIONS.TOGGLE_SCAN_ODBC:
      return {
        ...state,
        ...defaultModalStates,
        showScanOdbc: !state.showScanOdbc,
      };
    case ACTIONS.TOGGLE_FILE_UPLOADER:
      return {
        ...state,
        ...defaultModalStates,
        showFileUploader: !state.showFileUploader,
      };
    default:
      return state;
  }
};
