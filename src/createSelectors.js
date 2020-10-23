const createSelectors = ({ resource }) => {
    const fetchSingle = (state) => state[resource].records[0];

    return {
        fetchSingle,
    }
};

export default createSelectors;