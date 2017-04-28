import { ACTIONS } from '../actions/constants';

export const initialState = {
  databases: [],
  scans: [],
  tags: [],
  error: undefined,
};

function parseDate(item, createkey, modifyKey) {
  const c = new Date(item[createkey]);
  const m = new Date(item[modifyKey]);
  return {
    ...item,
    [createkey]: `${c.getFullYear()}/${c.getMonth() + 1}/${c.getDate()}`,
    [modifyKey]: `${m.getFullYear()}/${m.getMonth() + 1}/${m.getDate()}`,
  };
}

export default (state = initialState, action) => {
  if (action.error) {
    return {
      ...state,
      error: action.payload.message,
    };
  }
  switch (action.type) {
    case ACTIONS.FETCH_SCANS:
      return {
        ...state,
        error: undefined,
        scans: action.payload.data.map(scan => (
          parseDate(scan, 'created', 'modified')),
        ),
      };
    case ACTIONS.FETCH_DATABASES:
      return {
        ...state,
        error: undefined,
        databases: action.payload.data.map(database => (
          parseDate(database, 'created', 'modified')),
        ),
      };
    case ACTIONS.FETCH_TAGS:
      return {
        ...state,
        error: undefined,
        tags: action.payload.data.map(tag => (
          parseDate(tag, 'creation_date', 'change_date')),
        ),
      };
    default:
      return state;
  }
};
