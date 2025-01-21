import axios from 'axios';
import { addRequestInterceptor } from './requestInterceptor';
import { addResponseInterceptor } from './responseInterceptor';

const baseApi = axios.create({
  baseURL: `${window.AutoUpgradeVariables.admin_url}/autoupgrade/ajax-upgradetab.php`,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${() => window.AutoUpgradeVariables.token}`
  },
  transitional: {
    clarifyTimeoutError: true,
  },
});

addRequestInterceptor(baseApi);
addResponseInterceptor(baseApi);

export default baseApi;
