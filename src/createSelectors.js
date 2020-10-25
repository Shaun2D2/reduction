import { createSelector } from 'reselect';

const createSelectors = ({ resource }) => {
  const records = (state) => state[resource].collection;

  const getSingle = createSelector(
    records,
    (collection) => collection[0],
  );

  const getSingleById = createSelector(
    records,
    (id) => id,
    (collection, id) => collection.find((record) => record.id === id),
  );

  const getCollection = createSelector(
    records,
    (collection) => collection,
  );

  return {
    getSingle,
    getSingleById,
    getCollection,
  };
};

export default createSelectors;
