import axios from 'axios';
import { API_URL } from './constants';

const apiClient = axios.create({
	baseURL: API_URL
});

/**
 * Inject the header, otherwise continue
 * without any Auth token.
 */
apiClient.interceptors.request.use(
  async (config) => {
    console.log(config)
    try {
      return {
        ...config,
        headers: {
        //   ...config.headers,
        "Access-Control-Allow-Origin":"*",
        'Access-Control-Allow-Headers': '*',
        'content-type': 'application/json',
        },
      };
    } catch (e) {
      // no token in local storage
      return config;
    }
  },
  (error) => {console.log('------------', error); Promise.reject(error)}
);

const { get, post } = apiClient;
export { get, post };
