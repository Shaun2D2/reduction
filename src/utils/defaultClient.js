import axios from 'axios';

const createClient = ({ baseURL, axiosConfig }) => axios.create({ baseURL, ...axiosConfig });

export default createClient;
