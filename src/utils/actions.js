export const createActions = (resource) => ({
  loadCollection: `${resource}/LOAD_COLLECTION`,
  loadSingle: `${resource}/LOAD_SINGLE`,
  create: `${resource}/CREATE`,
  update: `${resource}/UPDATE`,
  delete: `${resource}/DELETE`,
  error: `${resource}/ERROR`,
  loading: `${resource}/LOADING`,
  loaded: `${resource}/LOADED`,
});

export const createActionCreators = (actions) => ({
  loadCollection: (data) => ({ type: actions.loadCollection, data }),
  loadSingle: (data) => ({ type: actions.loadSingle, data }),
  create: (data) => ({ type: actions.create, data }),
  update: (data) => ({ type: actions.update, data }),
  delete: (data) => ({ type: actions.delete, data }),
  loading: (data) => ({ type: actions.loading, data }),
  loaded: () => ({ type: actions.loaded }),
  error: (data) => ({ type: actions.error, data }),
});
