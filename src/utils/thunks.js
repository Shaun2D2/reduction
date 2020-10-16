import stringifyUrl from 'query-string';
import moment from 'moment';

const preventExecution = (state, config, force) => 
  state.loading || (config.defer && moment(state.lastModified).isBefore(moment.add(config.defer)) && !force)

const createThunks = (actions, resource, axios, config) => ({
  loadCollection: (dispatch, getState) => async ({ query, force = false }) => {
    const state = getState()[resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onLoad();

    const promise = axios.get(stringifyUrl({ url: `/${resource}`, query }))
      .then((response) => {
        const data = config.transformResponse(response.data);

        dispatch(actions.loadCollection(data));
        dispatch(actions.loaded());

        config.onLoaded();

        return response;
      })
      .catch((e) => {
        dispatch(actions.error(e));
        dispatch(actions.loading(false));
        config.onError(e);
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  loadSingle: (dispatch, getState) => async ({ id, query, force = false }) => {
    const state = getState()[resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onLoad();

    const promise = axios.get(stringifyUrl({ url: `/${resource}/${id}`, query }))
      .then((response) => {
        const data = config.transformResponse(response.data);

        dispatch(actions.loadSingle(data));
        dispatch(actions.loaded());

        config.onLoaded();

        return response;
      })
      .catch((e) => {
        dispatch(actions.error(e));

        config.onError(e);
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  delete: (dispatch, getState) => async ({ id, query, force = false }) => {
    const state = getState()[resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onDelete();

    const promise = axios.delete(stringifyUrl({ url: `/${resource}/${id}`, query }))
      .then(() => {
        config.onDeleted();

        dispatch(actions.delete({ id }));
        dispatch(actions.loaded());

        return {};
      }).catch((e) => {
        dispatch(actions.error(e));
        config.onError(e);
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  save: (dispatch, getState) => async ({ body, query, force = false }) => {
    const state = getState()[resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onSave();

    const promise = axios.post(stringifyUrl({ url: `/${resource}`, query }), body)
      .then((response) => {
        const data = config.transformResponse(response.data);
        config.onSaved();

        dispatch(actions.save(data));
        dispatch(actions.loading(false));
      })
      .catch((e) => {
        dispatch(actions.error(e));
        config.onError(e);
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  update: (dispatch, getState) => async ({ body, query, force = false }) => {
    const state = getState()[resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onUpdate();

    const promise = axios.put(stringifyUrl({ url: `/${resource}`, query }), body)
      .then((response) => {
        const data = config.transformResponse(response.data);

        config.onUpdated();

        dispatch(actions.save(data));
        dispatch(actions.loading(false));

        return response;
      })
      .catch((e) => {
        dispatch(actions.error(e));
      });


    dispatch(actions.loading(promise));

    return promise;
  },
});

export default createThunks;
