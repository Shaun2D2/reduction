import { stringifyUrl } from 'query-string';
import moment from 'moment';

const preventExecution = (state, config, force) => state.loading || (config.defer && moment(state.lastModified).isBefore(moment.add(config.defer)) && !force);

/**
 * implement some local persistence here.
 *
 * save to local store?
 */
const createThunks = ({ actions, client, config }) => ({
  loadCollection: ({ query, force = false, data }) => async (dispatch, getState) => {
    const state = getState()[config.resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onLoad();

    const promise = client.get(stringifyUrl({ url: `/${config.resource}`, query }))
      .then((response) => {
        const data = config.transformResponse(response.data);

        dispatch(actions.loadCollection(data));
        dispatch(actions.loaded());

        config.onLoaded();

        return Promise.resolve(response);
      })
      .catch((e) => {
        dispatch(actions.error(e));
        dispatch(actions.loading(false));
        config.onError(e);

        Promise.reject(e);
      })
      .finally(() => {
        dispatch(actions.loaded());
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  loadSingle: ({ id, query, force = false, data }) => async (dispatch, getState) => {
    const state = getState()[config.resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onLoad();

    const promise = client.get(stringifyUrl({ url: `/${config.resource}/${id}`, query }))
      .then((response) => {
        const data = config.transformResponse(response.data);

        dispatch(actions.loadSingle(data));
        dispatch(actions.loaded());

        config.onLoaded();

        return Promise.resolve(response);
      })
      .catch((e) => {
        dispatch(actions.error(e));

        config.onError(e);

        return Promise.reject(e);
      })
      .finally(() => {
        dispatch(actions.loaded());
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  delete: ({ id, query, force = false }) => async (dispatch, getState) => {
    const state = getState()[config.resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onDelete();

    if (config.optimistic) dispatch(actions.delete({ id }));

    const promise = client.delete(stringifyUrl({ url: `/${config.resource}/${id}`, query }))
      .then(() => {
        config.onDeleted();

        if (!config.optimistic) dispatch(actions.delete({ id }));
        dispatch(actions.loaded());

        return Promise.resolve({});
      }).catch((e) => {
        dispatch(actions.error(e));
        config.onError(e);

        return Promise.reject(e);
      })
      .finally(() => {
        dispatch(actions.loaded());
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  create: ({ body, query, force = false }) => (dispatch, getState) => {
    const state = getState()[config.resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onSave();

    const promise = client.post(stringifyUrl({ url: `/${config.resource}`, query }), body)
      .then((response) => {
        const data = config.transformResponse(response.data);
        config.onSaved();

        if (!config.optimistic) dispatch(actions.create(data));
        dispatch(actions.loading(false));

        Promise.resolve(data);
      })
      .catch((e) => {
        dispatch(actions.error(e));
        dispatch(actions.loading(false));
        config.onError(e);

        return Promise.reject(e);
      })
      .finally(() => {
        dispatch(actions.loaded());
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  update: ({ body, query, force = false }) => async (dispatch, getState) => {
    const state = getState()[config.resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onUpdate();

    if (config.optimistic) dispatch(actions.update(body));

    const promise = client.put(stringifyUrl({ url: `/${config.resource}`, query }), body)
      .then((response) => {
        const data = config.transformResponse(response.data);

        config.onUpdated();

        if (!config.optimistic) dispatch(actions.update(data));
        dispatch(actions.loading(false));

        return Promise.resolve(response);
      })
      .catch((e) => {
        dispatch(actions.error(e));

        return Promise.reject(e);
      })
      .finally(() => {
        dispatch(actions.loaded());
      });

    dispatch(actions.loading(promise));

    return promise;
  },
});

export default createThunks;
