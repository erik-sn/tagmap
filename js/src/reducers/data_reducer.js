import { ACTIONS } from '../actions/constants';

export const initialState = {
  scans: [],
  tags: [],
};

function parseDate(scan, createkey = 'created', modifyKey = 'modified') {
  const c = new Date(scan[createkey]);
  const m = new Date(scan[modifyKey]);
  return {
    ...scan,
    [createkey]: `${c.getFullYear()}/${c.getMonth() + 1}/${c.getDate()}`,
    [modifyKey]: `${m.getFullYear()}/${m.getMonth() + 1}/${m.getDate()}`,
  };
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_SCANS:
      return {
        ...state,
        scans: action.payload.data.map(parseDate),
      };
    case ACTIONS.FETCH_TAGS:
      return {
        ...state,
        tags: action.payload.data.map(scan => (
          parseDate(scan, 'creation_date', 'change_date')),
        ),
      };
    default:
      return state;
  }
};