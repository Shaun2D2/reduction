/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
/* eslint-disable no-param-reassign */
import { snakeCase } from 'snake-case';
import identity from 'lodash/identity';
import noop from 'lodash/noop';
import set from 'lodash/set';
import produce from 'immer';
import moment from 'moment';

import { createActions, createActionCreators } from './utils/actions';
import deafultClient from './utils/defaultClient';
import createSelectors from './createSelectors';
import createThunks from './utils/thunks';

export const INITIAL_STATE = {
  collection: [],
  loaded: [],
  loading: null,
  loadedLast: null,
  lastModified: null,
  error: null,
};

export const BASE_CONFIG = {
  onLoad: noop,
  onLoaded: noop,
  onDelete: noop,
  onDeleted: noop,
  onUpdate: noop,
  onUpdated: noop,
  onSave: noop,
  onSaved: noop,
  onError: noop,
  attachToWindow: true,
  transformResponse: identity,
  optimisticUpdates: false,
  persistence: 'rest',
  axios: {},
};

export const configureReducers = (rootConfig) => (reducerConfig) => {
  const config = {
    ...rootConfig,
    ...reducerConfig,
    ...BASE_CONFIG,
    resource: snakeCase(reducerConfig.resource.toUpperCase()),
  };

  const client = deafultClient({ baseURL: config.baseURL, config: config.axios});
  const actions = createActions(config.resource);
  const actionCreators = createActionCreators(actions, config);
  const thunks = createThunks({
    actions: actionCreators,
    client,
    config,
  });

  const reducer = produce((draft, action) => {
    switch (action.type) {
      case actions.loadCollection:
        draft.collection.concat(action.data);
        draft.lastModified = moment();
        draft.loaded.concat(action.data.map((item) => `${item.id}`)).filter((item, index, array) => array.indexOf(item) === index);

        break;
      case actions.loadSingle:
      case actions.create:
        draft.collection.push(action.data);
        draft.lastModified = moment();
        draft.loaded.push(action.data.id);
        draft.loaded.filter((item, index, array) => array.indexOf(item) === index);

        break;
      case actions.update:
        const index = draft.collection.findIndex((record) => record.id === action.data.id);

        if (index) {
          draft.collection.splice(index, 1, action.data);
          draft.lastModified = moment();
        }

        break;
      case actions.loading:
        draft.loading = true;

        break;
      case actions.loaded:
        draft.loading = false;

        break;
      case actions.delete:
        const removeIndex = draft.collection.findIndex((record) => record.id === action.data.id);

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

  const selectors = createSelectors({ resource: config.resource });

  const fullReducer = {
    reducer,
    actionCreators,
    actions,
    thunks,
    client,
    selectors,
  };

  if (config.attachToWindow) {
    set(window, `reduction.${config.resource}`, fullReducer);
  }

  return fullReducer;
};
