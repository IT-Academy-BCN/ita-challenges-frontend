export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  BACKEND_ITA_CHALLENGE_BASE_URL: '',
  BACKEND_ITA_WIKI_BASE_URL: 'https://dev.api.itadirectory.eurecatacademy.org/api/v1',
  BACKEND_ALL_CHALLENGES: '/challenges',
  BACKEND_REGISTER: '/auth/register',
  BACKEND_LOGIN:'/auth/login',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer ',
  BACKEND_TOKEN: '',
  pageSize: 8
};
