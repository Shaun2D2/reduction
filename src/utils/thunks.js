import stringifyUrl from 'query-string';
import moment from 'moment';

const createThunks = (actions, resource, axios, config) => {
    return ({
        loadCollection: (dispatch, getState) => 
            async ({ query, force = false }) => {
                try {
                    const state = getState()[resource];

                    if (state.loading || (config.defer && moment(state.lastModified).isBefore(moment.add(config.defer)) && !force)) return state;

                    dispatch(actions.loading(true));

                    const response = await axios.get(stringifyUrl({ url: `/${resource}`, query }))

                    dispatch(actions.loadCollection(response.data));
                    dispatch(actions.loading(false));

                    return response;

                } catch(e) {
                    dispatch(actions.error(e));
                    dispatch(actions.loading(false));
                }
            },
        loadSingle: (dispatch) => 
            async ({ id, query }) => {
                try {
                    const state = getState()[resource];

                    if (state.loading || (config.defer && moment(state.lastModified).isBefore(moment.add(config.defer)) && !force)) return state;

                    dispatch(actions.loading(true));

                    const response = await axios.get(stringifyUrl({ url: `/${resource}/${id}`, query }))

                    dispatch(actions.loadSingle(response.data));
                    dispatch(actions.loading(false));

                    return response;

                } catch(e) {
                    dispatch(actions.error(e));
                    dispatch(actions.loading(false));
                }
            },
        delete: (dispatch) => 
            async ({ id, query }) => {
                try {
                    const state = getState()[resource];

                    if (state.loading || (config.defer && moment(state.lastModified).isBefore(moment.add(config.defer)) && !force)) return state;

                    dispatch(actions.loading(true));

                    const response = await axios.delete(stringifyUrl({ url: `/${resource}/${id}`, query }))

                    dispatch(actions.delete({ id }));
                    dispatch(actions.loading(false));

                    return response;

                } catch(e) {
                    dispatch(actions.error(e));
                    dispatch(actions.loading(false));
                }
            },
        save: (dispatch) => 
            async ({ body, query }) => {
                try {
                    const state = getState()[resource];

                    if (state.loading || (config.defer && moment(state.lastModified).isBefore(moment.add(config.defer)) && !force)) return state;

                    dispatch(actions.loading(true));

                    const response = await axios.post(stringifyUrl({ url: `/${resource}`, query }), body);

                    dispatch(actions.save(response.data));
                    dispatch(actions.loading(false));

                    return response;

                } catch(e) {
                    dispatch(actions.error(e));
                    dispatch(actions.loading(false));
                }
            },
        update: (dispatch) => 
            async ({ body, query }) => {
                try {
                    const state = getState()[resource];

                    if (state.loading || (config.defer && moment(state.lastModified).isBefore(moment.add(config.defer)) && !force)) return state;

                    dispatch(actions.loading(true));

                    const response = await axios.put(stringifyUrl({ url: `/${resource}`, query }), body);

                    dispatch(actions.save(response.data));
                    dispatch(actions.loading(false));

                    return response;

                } catch(e) {
                    dispatch(actions.error(e));
                    dispatch(actions.loading(false));
                }
            },
    });
};

export default createThunks;