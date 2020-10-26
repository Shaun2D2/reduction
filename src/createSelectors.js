import { create } from 'lodash';
import { createSelector } from 'reselect';

const createSelectors = ({ resource }) => {
  const resourceState = (state) => state[resource];

  const getCollection = createSelector(
    resourceState,
    (state) => state.collection,
  );

  const getSingle = createSelector(
    getCollection,
    (collection) => collection[0],
  );

  const getSingleById = createSelector(
    getCollection,
    (id) => id,
    (collection, id) => collection.find((record) => record.id === id),
  );

  const getLoadedIds = createSelector(
    resourceState,
    (state) => state.loaded,
  );

  const getRecordByPropertyValue = createSelector(
    getCollection,
    (property) => property,
    (value) => value,
    (collection, property, value) => collection.find((item) => item[property] === value),
  );

  return {
    getSingle,
    getSingleById,
    getCollection,
    getLoadedIds,
    getRecordByPropertyValue,
  };
};

export default createSelectors;
