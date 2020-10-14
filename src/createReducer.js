import queryString from 'query-string';
import { snakeCase } from "snake-case";
import axios from 'axios';

import { createActions, createActionCreators} from './utils/actions';
import createThunks from './utils/thunks';
import moment from 'moment';

const INITIAL_STATE = {
    collection: [],
    loaded: [],
    loading: null,
    loadedLast: null,
    lastModified: null,
    error: null,
}

const configureReducers = (rootConfig) => (reducerConfig) => {
    const config = {
        ...rootConfig,
        ...reducerConfig,
        resource: snakeCase(reducerConfig.toUpperCase())
    };

    const actions = createActions(config.resource);
    const actionCreators = createActionCreators(actions, config);
    const thunks = createThunks(actionsCreators);

    const reducer = (state = INITIAL_STATE, action) => {
        switch(action.type) {
            case actions.loadCollection:
                return {
                    ...state,
                    records: action.data,
                    lastModified: moment(),
                    loaded: action.data.map(item => `${item.id}`)
                };
            case actions.loadSingle:
            case actions.update:
            case actions.create:
                return {
                    ...state,
                    records: [
                        ...state.records.filter(record => record.id !== action.data.id),
                        action.data
                    ],
                    lastModified: moment()
                };
            case actions.loading:
                return {
                    ...state,
                    loading: true
                };
            case actions.delete:
                return {
                    ...state,
                    records: [
                        ...state.records.filter(record => record.id !== action.data.id),
                    ],
                    lastModified: moment()
                };
            case actions.error:
                return {
                    ...state,
                    error: action.data
                };
            default:
                return state;
        }
    };

    return {
        reducer,
        actionCreators,
        actions,
        thunks
    }
}

export default configureReducers;

