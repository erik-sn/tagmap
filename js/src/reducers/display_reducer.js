import { ACTIONS } from '../actions/constants';

export const initialState = {
  showOdbc: false,
  showFileUploader: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_ODBC:
      return {
        ...state,
        showOdbc: !state.showOdbc,
        showFileUploader: false,
      };
    case ACTIONS.TOGGLE_FILE_UPLOADER:
      return {
        ...state,
        showOdbc: false,
        showFileUploader: !state.showFileUploader,
      };
    default:
      return state;
  }
};