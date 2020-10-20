import axios from 'axios';

const createClient = ({ baseURL, axiosConfig }) => axios.create({ baseURL, withCredentials: true, ...axiosConfig });

export default createClient;
