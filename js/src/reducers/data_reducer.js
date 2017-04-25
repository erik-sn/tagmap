import { ACTIONS } from '../actions/constants';

export const initialState = {
  databases: [],
  scans: [],
  tags: [],
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
  switch (action.type) {
    case ACTIONS.FETCH_SCANS:
      return {
        ...state,
        scans: action.payload.data.map(scan => (
          parseDate(scan, 'created', 'modified')),
        ),
      };
    case ACTIONS.FETCH_DATABASES:
      return {
        ...state,
        databases: action.payload.data.map(database => (
          parseDate(database, 'created', 'modified')),
        ),
      };
    case ACTIONS.FETCH_TAGS:
      return {
        ...state,
        tags: action.payload.data.map(tag => (
          parseDate(tag, 'creation_date', 'change_date')),
        ),
      };
    default:
      return state;
  }
};