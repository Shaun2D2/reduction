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
  loadSingle: ({ id, query, force = false, data,}) => async (dispatch, getState) => {
    const state = getState()[config.resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onLoad();

    const promise = client.get(stringifyUrl({ url: `/${config.resource}/${id}`, query }))
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

        return {};
      }).catch((e) => {
        dispatch(actions.error(e));
        config.onError(e);
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  save: ({ body, query, force = false }) => async (dispatch, getState) => {
    const state = getState()[config.resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onSave();

    if (config.optimistic) dispatch(config.transformResponse(actions.save(data)));

    const promise = client.post(stringifyUrl({ url: `/${config.resource}`, query }), body)
      .then((response) => {
        const data = config.transformResponse(response.data);
        config.onSaved();

        if (!config.optimistic) dispatch(actions.save(data));
        dispatch(actions.loading(false));
      })
      .catch((e) => {
        dispatch(actions.error(e));
        config.onError(e);
      });

    dispatch(actions.loading(promise));

    return promise;
  },
  update: ({ body, query, force = false }) => async (dispatch, getState) => {
    const state = getState()[config.resource];

    if (preventExecution(state, config, force)) return state.loading;

    config.onUpdate();

    if (config.optimistic) dispatch(actions.save(data));

    const promise = client.put(stringifyUrl({ url: `/${config.resource}`, query }), body)
      .then((response) => {
        const data = config.transformResponse(response.data);

        config.onUpdated();

        if (!config.optimistic) dispatch(actions.save(data));
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
