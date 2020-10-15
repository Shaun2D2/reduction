/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
import { snakeCase } from 'snake-case';
import produce from 'immer';
import moment from 'moment';

import { createActions, createActionCreators } from './utils/actions';
import createThunks from './utils/thunks';

export const INITIAL_STATE = {
  collection: [],
  loaded: [],
  loading: null,
  loadedLast: null,
  lastModified: null,
  error: null,
};

export const configureReducers = (rootConfig) => (reducerConfig) => {
  const config = {
    ...rootConfig,
    ...reducerConfig,
    resource: snakeCase(reducerConfig.resource.toUpperCase()),
  };

  const actions = createActions(config.resource);
  const actionCreators = createActionCreators(actions, config);
  const thunks = createThunks(actionCreators);

  const reducer = produce((draft, action) => {
    switch (action.type) {
      case actions.loadCollection:
        draft.records.concat(action.data);
        draft.lastModified = moment();
        draft.loaded.concat(action.data.map((item) => `${item.id}`)).filter((item, index, array) => array.indexOf(item) === index);

        break;
      case actions.loadSingle:
      case actions.create:
        draft.records.push(action.data);
        draft.lastModified = moment();
        draft.loaded.push(action.data.id);
        draft.loaded.filter((item, index, array) => array.indexOf(item) === index);

        break;
      case actions.update:
        const index = draft.records.findIndex((record) => record.id === action.data.id);

        if (index) {
          draft.records.splice(index, 1, action.data);
          draft.lastModified = moment();
        }

        break;
      case actions.loading:
        draft.loading = true;

        break;
      case actions.delete:
        const removeIndex = draft.records.findIndex((record) => record.id === action.data.id);

        if (index) {
          draft.splice(removeIndex, 1);
          draft.lastModified = moment();
          draft.loaded.filter((item) => item !== action.data.id);
        }

        break;
      case actions.error:
        draft.error = action.data;

        break;
    }
  }, INITIAL_STATE);

  return {
    reducer,
    actionCreators,
    actions,
    thunks,
  };
};
