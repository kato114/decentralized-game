import axios from 'axios';
import getCachedSession from 'common/GetCachedSession';

const call = (url, method, withToken = true, data = {}) => {
  let header = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const userAddress = localStorage.getItem('userAddress');
  if (userAddress) {
    data.userAddress = userAddress;
  }

  if (withToken && data.userAddress) {
    const cachedSession = getCachedSession(data.userAddress);

    if (!cachedSession.token) {
      return new Promise((resolve, reject) => {
        reject("Couldn't get an access token");
      });
    }

    header['Authorization'] = `Bearer ${cachedSession.token}`;
  }

  const options = {
    url,
    method,
    headers: header,
    crossDomain: true,
    data
  };
  return axios
    .request(options)
    .then(res => res.data)
    .catch(error => {
      console.log('Error:', error);
      return error.response?.data || error.response;
    });
};

export default call;
